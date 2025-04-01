const axios = require('axios');

async function testCsrf() {
    try {
        console.log('1. Trying to get CSRF token...');
        const tokenResponse = await axios.get('http://localhost:3000/api/csrf-token', {
            withCredentials: true
        });

        const csrfToken = tokenResponse.data.data.csrfToken;
        console.log('CSRF token received:', csrfToken);

        // Save cookies from the response for next request
        const cookies = tokenResponse.headers['set-cookie'];

        // Try a request to a protected route without CSRF token (should fail)
        try {
            console.log('\n2. Testing protected route WITHOUT token (should fail):');
            await axios.post('http://localhost:3000/api/auth/change-password', {
                password: 'test',
                passwordConfirm: 'test'
            }, {
                withCredentials: true,
                headers: {
                    Cookie: cookies
                }
            });
            console.log('Error: Request succeeded without CSRF token!');
        } catch (error) {
            console.log('Success: Protected request blocked as expected!');
            console.log('Error message:', (error.response && error.response.data && error.response.data.message) || error.message);
        }

        // Try a request with the proper CSRF token (should succeed)
        try {
            console.log('\n3. Testing protected route WITH token (should succeed):');
            const response = await axios.post('http://localhost:3000/api/auth/change-password', {
                password: 'test',
                passwordConfirm: 'test'
            }, {
                withCredentials: true,
                headers: {
                    'x-csrf-token': csrfToken,
                    Cookie: cookies
                }
            });
            console.log('Success: Protected request succeeded with CSRF token!');
            console.log('Response:', response.data);
        } catch (error) {
            console.log('Error: Protected request failed even with CSRF token');
            console.log('Error message:', (error.response && error.response.data && error.response.data.message) || error.message);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testCsrf();