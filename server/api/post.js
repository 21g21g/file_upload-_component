export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        if (!body.changedFiles) {
            event.res.statusCode = 400; 
            return { error: 'changedFiles is required' };
        }


        // Make a POST request to the external API (postman-echo in this case)
        const response = await fetch('https://postman-echo.com/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ changedFiles: body.changedFiles }), // Use the received data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();
        return data; 
    } catch (error) {
        event.res.statusCode = 500; // Internal Server Error
        return { error: error.message };
    }
})