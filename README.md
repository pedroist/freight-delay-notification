## About
Next.js application that monitors traffic delays on freight delivery routes and notifies customers when significant delays occur. The system will use Temporal for workflow orchestration, integrating with traffic APIs, OpenAI for message generation, and a notification service.

## Features
- Monitor traffic delays on freight delivery routes
- Notify customers when significant delays occur
- Use Temporal for workflow orchestration
- Integrate with traffic APIs

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file and add your API keys and configuration

```
# APIKeys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Configuration
DELAY_THRESHOLD_MINUTES=30
TEMPORAL_ADDRESS=localhost:7233
```

## Running the application
1. Start the Temporal server: `temporal server start`
2. Start the Next.js application: `npm run dev`

## Notes:
1. Used React Query for the api requests
2. Used Temporal for the workflow orchestration
3. Used OpenAI for the message generation
4. Used SendGrid for the notification service
5. Used Google Maps API for the traffic data
6. Used Material UI for the frontend
7. Installed the following google maps libraries:
- @react-google-maps/api
- @googlemaps/google-maps-services-js

These provide access to:
- Google Places API - used for the autocomplete functionality when users type in origin and destination addresses
- Google Directions API - used to calculate travel times with and without traffic, which is essential for determining delays.
9. Synchronous blocking request to the temporal server, since the response time is not long, to be able to get all the needed data and render a confirmation page to the user.
8. In the file src/components/providers/ReactQueryProvider.tsx, the following config options were added by the following reasons:
- **refetchOnWindowFocus: false** - to prevent the api from refetching when the window is focused

- **retry: 1** -To prevent the API from retrying 3 times when it fails, setting it to 1, to improve the user experience (not making users wait too long for a response).





