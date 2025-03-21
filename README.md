## About
Next.js application that monitors traffic delays on freight delivery routes and notifies customers when significant delays occur. The system uses Temporal for workflow orchestration, integrating with traffic APIs, OpenAI for message generation, and SendGrid for notifications.

## Features
- Monitor traffic delays on freight delivery routes
- Notify customers when significant delays occur
- Use Temporal for workflow orchestration
- Integrated Google Maps APIs to get the traffic data and calculate the travel times with and without traffic
- Integrated OpenAI to generate the delay message
- Integrated SendGrid to send the notification to the customer

## Prerequisites

- Node.js (v18 or later)
- npm
- Temporal CLI (required for `npm run dev:all` - see installation instructions below)

## Installing Temporal CLI

### On macOS
```bash
brew install temporal
```

### On Windows
Choose one of these options:

1. **Using npm (Recommended for this project)**
   ```bash
   npm install -g @temporalio/cli
   ```

2. **Using Chocolatey**
   ```powershell
   choco install temporal-cli
   ```

3. **Manual Installation**
   - Download from [Temporal CLI releases](https://github.com/temporalio/cli/releases)
   - Extract and add to PATH

## Running the Application

### With Temporal CLI installed
```bash
# Run everything with one command (Temporal server, Next.js app, and worker)
npm run dev:all
```

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Follow the previous instructions to install the Temporal CLI
4. Create a `.env.local` file and add your API keys and configuration

```# APIKeys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Configuration
DELAY_THRESHOLD_MINUTES=30 # play around reducing this number to see a notification with delay
TEMPORAL_ADDRESS=localhost:7233
```

## Running the application
1. Start the Temporal server: `temporal server start`
2. Start the Next.js application: `npm run dev`

## Application flow according to this architecture:

1. The client (browser) submits a route monitoring request
2. The Next.js API route receives this request
3. The API route calls the Temporal client to start a workflow
4. The Temporal worker (running as a separate process) executes the workflow
5. The workflow activities call these utility functions (getTrafficInfo, generateDelayMessage)


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
8. Synchronous blocking request to the temporal server, since the response time is not long, to be able to get all the needed data and render a confirmation page to the user.
9. In the file src/components/providers/ReactQueryProvider.tsx, the following config options were added by the following reasons:
- **refetchOnWindowFocus: false** - to prevent the api from refetching when the window is focused

- **retry: 1** -To prevent the API from retrying 3 times when it fails, setting it to 1, to improve the user experience (not making users wait too long for a response).
10. A file with the name GooglePlacesAutocomplete.tsx was created to handle the autocomplete functionality. However, it was not used in the project, since the autocomplete was not working as expected: it was resulting in a Request Denied, even though on Google Cloud Platform, the API was enabled. So, normal input fields were used instead: the origin and destination must be full and correct cities and addresses for the application to work.






