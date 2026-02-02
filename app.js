// Global variables
let calendar;
let map;
let currentUser = null;
let trailerMarker;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await checkUser();
    initializeCalendar();
    initializeMap();
    loadTrailerInfo();
    loadReservations();
    setupEventListeners();
    
    // Subscribe to real-time updates
    subscribeToReservations();
});

// ============================================
// Authentication Functions
// ============================================

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateAuthUI();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmail = document.getElementById('user-email');
    const reservationForm = document.getElementById('reservation-form');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userEmail.style.display = 'block';
        userEmail.textContent = currentUser.email;
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userEmail.style.display = 'none';
        reservationForm.style.display = 'none';
    }
}

async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        alert('Login failed: ' + error.message);
        return false;
    }
    
    currentUser = data.user;
    updateAuthUI();
    closeModal();
    return true;
}

async function signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    
    if (error) {
        alert('Signup failed: ' + error.message);
        return false;
    }
    
    alert('Signup successful! Please check your email to confirm your account.');
    return true;
}

async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    updateAuthUI();
    calendar.refetchEvents();
}

// ============================================
// Calendar Functions
// ============================================

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        selectable: true,
        select: handleDateSelect,
        eventClick: handleEventClick,
        events: fetchCalendarEvents,
        height: 'auto',
        // Mobile-friendly settings
        contentHeight: 'auto',
        aspectRatio: 1.5
    });
    calendar.render();
}

async function fetchCalendarEvents(info, successCallback, failureCallback) {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .gte('end_date', info.startStr)
            .lte('start_date', info.endStr);
        
        if (error) throw error;
        
        const events = data.map(reservation => ({
            id: reservation.id,
            title: reservation.status === 'confirmed' ? 'Reserved' : 'Pending',
            start: reservation.start_date,
            end: reservation.end_date,
            backgroundColor: reservation.status === 'confirmed' ? '#e74c3c' : '#f39c12',
            extendedProps: {
                userId: reservation.user_id,
                userEmail: reservation.user_email,
                status: reservation.status,
                notes: reservation.notes
            }
        }));
        
        successCallback(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        failureCallback(error);
    }
}

function handleDateSelect(selectInfo) {
    if (!currentUser) {
        alert('Please login to make a reservation');
        calendar.unselect();
        return;
    }
    
    // Show reservation form
    document.getElementById('reservation-form').style.display = 'block';
    document.getElementById('start-date').value = selectInfo.startStr;
    document.getElementById('end-date').value = selectInfo.endStr;
    
    // Scroll to form
    document.getElementById('reservation-form').scrollIntoView({ behavior: 'smooth' });
    calendar.unselect();
}

function handleEventClick(clickInfo) {
    const event = clickInfo.event;
    const props = event.extendedProps;
    
    let message = `Reservation Details:\n\n`;
    message += `Status: ${props.status}\n`;
    message += `Reserved by: ${props.userEmail}\n`;
    message += `Start: ${event.start.toLocaleDateString()}\n`;
    message += `End: ${event.end ? event.end.toLocaleDateString() : 'N/A'}\n`;
    if (props.notes) message += `Notes: ${props.notes}\n`;
    
    // Allow cancellation if it's the user's reservation
    if (currentUser && currentUser.id === props.userId) {
        if (confirm(message + '\nDo you want to cancel this reservation?')) {
            cancelReservation(event.id);
        }
    } else {
        alert(message);
    }
}

// ============================================
// Reservation Functions
// ============================================

async function createReservation(startDate, endDate, notes) {
    if (!currentUser) {
        alert('Please login to make a reservation');
        return false;
    }
    
    // Check for conflicts
    const { data: conflicts } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'confirmed')
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);
    
    if (conflicts && conflicts.length > 0) {
        alert('Sorry, the trailer is already reserved for these dates.');
        return false;
    }
    
    const { data, error } = await supabase
        .from('reservations')
        .insert([
            {
                user_id: currentUser.id,
                user_email: currentUser.email,
                start_date: startDate,
                end_date: endDate,
                status: 'pending',
                notes: notes
            }
        ])
        .select();
    
    if (error) {
        console.error('Error creating reservation:', error);
        alert('Failed to create reservation: ' + error.message);
        return false;
    }
    
    alert('Reservation request submitted successfully!');
    calendar.refetchEvents();
    loadReservations();
    return true;
}

async function cancelReservation(reservationId) {
    const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId)
        .eq('user_id', currentUser.id); // Security: only allow users to delete their own
    
    if (error) {
        alert('Failed to cancel reservation: ' + error.message);
        return false;
    }
    
    alert('Reservation cancelled successfully');
    calendar.refetchEvents();
    loadReservations();
    return true;
}

async function updateReservationStatus(reservationId, status) {
    const { error } = await supabase
        .from('reservations')
        .update({ status: status })
        .eq('id', reservationId);
    
    if (error) {
        alert('Failed to update reservation: ' + error.message);
        return false;
    }
    
    calendar.refetchEvents();
    loadReservations();
    return true;
}

async function loadReservations() {
    const container = document.getElementById('reservations-container');
    
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .gte('end_date', new Date().toISOString())
            .order('start_date', { ascending: true });
        
        if (error) throw error;
        
        if (data.length === 0) {
            container.innerHTML = '<p>No upcoming reservations</p>';
            return;
        }
        
        container.innerHTML = data.map(reservation => {
            const isOwner = currentUser && currentUser.id === reservation.user_id;
            const startDate = new Date(reservation.start_date).toLocaleDateString();
            const endDate = new Date(reservation.end_date).toLocaleDateString();
            
            return `
                <div class="reservation-item ${reservation.status}">
                    <h4>${startDate} - ${endDate}</h4>
                    <p><strong>Status:</strong> ${reservation.status}</p>
                    <p><strong>Reserved by:</strong> ${reservation.user_email}</p>
                    ${reservation.notes ? `<p><strong>Notes:</strong> ${reservation.notes}</p>` : ''}
                    ${isOwner ? `
                        <div class="reservation-actions">
                            <button class="btn btn-secondary" onclick="cancelReservation('${reservation.id}')">Cancel</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading reservations:', error);
        container.innerHTML = '<p>Error loading reservations</p>';
    }
}

// ============================================
// Map & Location Functions
// ============================================

function initializeMap() {
    // Default center (you can change this)
    map = L.map('map').setView([37.7749, -122.4194], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    trailerMarker = L.marker([37.7749, -122.4194]).addTo(map)
        .bindPopup('Trailer Location')
        .openPopup();
}

async function loadTrailerInfo() {
    try {
        const { data, error } = await supabase
            .from('trailer')
            .select('*')
            .single();
        
        if (error) {
            // If no trailer exists, create default entry
            if (error.code === 'PGRST116') {
                await createDefaultTrailer();
                return;
            }
            throw error;
        }
        
        // Update UI
        document.getElementById('current-location').textContent = data.current_location || 'Not set';
        document.getElementById('last-updated').textContent = data.last_updated 
            ? new Date(data.last_updated).toLocaleString() 
            : 'Never';
        
        // Update map if coordinates exist
        if (data.latitude && data.longitude) {
            const latLng = [data.latitude, data.longitude];
            trailerMarker.setLatLng(latLng);
            map.setView(latLng, 13);
        }
    } catch (error) {
        console.error('Error loading trailer info:', error);
    }
}

async function createDefaultTrailer() {
    const { error } = await supabase
        .from('trailer')
        .insert([
            {
                current_location: 'Home Base',
                latitude: 37.7749,
                longitude: -122.4194,
                last_updated: new Date().toISOString()
            }
        ]);
    
    if (!error) {
        loadTrailerInfo();
    }
}

async function updateTrailerLocation() {
    if (!currentUser) {
        alert('Please login to update location');
        return;
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Reverse geocode to get address (optional)
            const locationName = prompt('Enter location description:', 'Current Location');
            
            if (!locationName) return;
            
            const { error } = await supabase
                .from('trailer')
                .update({
                    current_location: locationName,
                    latitude: lat,
                    longitude: lng,
                    last_updated: new Date().toISOString(),
                    updated_by: currentUser.email
                })
                .eq('id', 1); // Assuming single trailer with id 1
            
            if (error) {
                alert('Failed to update location: ' + error.message);
                return;
            }
            
            alert('Location updated successfully!');
            loadTrailerInfo();
        }, (error) => {
            alert('Failed to get your location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// ============================================
// Real-time Subscriptions
// ============================================

function subscribeToReservations() {
    supabase
        .channel('reservations')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'reservations' }, 
            (payload) => {
                console.log('Reservation changed:', payload);
                calendar.refetchEvents();
                loadReservations();
            }
        )
        .subscribe();
}

// ============================================
// Event Listeners Setup
// ============================================

function setupEventListeners() {
    // Login button
    document.getElementById('login-btn').addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'flex';
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Close modal
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await login(email, password);
    });
    
    // Signup button
    document.getElementById('signup-btn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email && password) {
            await signup(email, password);
        } else {
            alert('Please enter email and password');
        }
    });
    
    // Reservation form
    document.getElementById('new-reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const notes = document.getElementById('notes').value;
        
        const success = await createReservation(startDate, endDate, notes);
        if (success) {
            document.getElementById('reservation-form').style.display = 'none';
            document.getElementById('new-reservation-form').reset();
        }
    });
    
    // Cancel reservation button
    document.getElementById('cancel-reservation-btn').addEventListener('click', () => {
        document.getElementById('reservation-form').style.display = 'none';
        document.getElementById('new-reservation-form').reset();
    });
    
    // Update location button
    document.getElementById('update-location-btn').addEventListener('click', updateTrailerLocation);
}

function closeModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('login-modal');
    if (e.target === modal) {
        closeModal();
    }
});
