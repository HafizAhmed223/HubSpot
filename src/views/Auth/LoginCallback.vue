<template>
    <div>
        <h1>Processing...</h1>
        <p>Please wait while we authenticate your account.</p>
    </div>
</template>

<script>
export default {
    name: 'LoginCallback',
    mounted() {
        // Extract the token from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Save the token to localStorage
            localStorage.setItem('hubspotToken', token);
            console.log('HubSpot Token has been saved:', token);
            // Redirect to the dashboard or another page
            this.$router.push('/');
        } else {
            console.error('No token found in the URL.');
            // Optionally redirect to an error page or display a message
            this.$router.push('/login');
        }
    }
};
</script>
