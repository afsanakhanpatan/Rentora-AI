\# Rentora AI



Rentora AI is an AI-powered rental assistant designed for rental businesses. Customers can interact with the assistant using \*\*text or microphone input\*\* to find vehicles, check availability, understand rental pricing, and complete bookings through a conversational interface.



\## What Rentora AI Does



A customer can communicate naturally with Rentora AI, for example:



> "I need a bike in Ongole tomorrow for 2 days."



Rentora AI processes the request and can:



\* Identify the requested vehicle category

\* Identify the rental location

\* Understand the rental date

\* Understand the rental duration

\* Check available vehicles

\* Display vehicle options and prices

\* Allow the customer to select a specific vehicle

\* Calculate the rental amount

\* Confirm the booking

\* Provide pickup-location information



Customers can provide their requests either by \*\*typing\*\* or by using the \*\*microphone input\*\*.



\## Current Features



\### AI Rental Assistant



\* Conversational rental interaction

\* Natural-language booking requests

\* AI-powered understanding of customer messages

\* Text and microphone input



\### Vehicle Availability



\* Multiple vehicle categories

\* Multiple rental locations

\* Vehicle-specific pricing

\* Availability checking

\* Vehicle selection



\### Booking



\* Rental date handling

\* Rental duration handling

\* Automatic price calculation

\* Booking confirmation

\* Booking ID generation



\### Pickup Information



\* Pickup-location information based on the selected rental location

\* Pickup instructions included with booking information



\### Customer Accounts



\* Customer registration

\* Customer login

\* Customer information used during booking



\### Dashboard



\* Booking information

\* Rental business data

\* Customer and booking activity



\## Technology Stack



\### Frontend



\* React

\* Vite

\* JavaScript

\* HTML

\* CSS



\### Backend



\* Node.js

\* Express.js

\* REST APIs



\### AI



\* Groq API

\* OpenAI GPT-OSS model

\* Whisper speech-to-text



\### Other Technologies



\* Git

\* GitHub

\* Session-based conversation handling

\* JSON-based customer storage



\## Example Conversation



\*\*Customer:\*\*



> I want a bike in Ongole tomorrow for 2 days.



\*\*Rentora AI:\*\*



> I found an available bike in Ongole.



The assistant can then provide the available vehicle, daily price, rental duration, total price, and continue the booking process.



\## Project Structure



```text

Rentora/

│

├── backend/

│   ├── server.js

│   ├── knowledge/

│   ├── data/

│   ├── package.json

│   └── .env

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   └── App.jsx

│   ├── package.json

│   └── vite.config.js

│

└── README.md

```



\## Project Status



Rentora AI is currently in the \*\*working prototype stage\*\*.



The core rental conversation, vehicle availability, pricing, booking flow, pickup information, text interaction, and microphone input are implemented.



Future development can include additional voice-agent capabilities, production deployment, persistent databases, payment integration, and more advanced rental-business management features.



\## Purpose



Rentora AI demonstrates how conversational AI can be used to simplify vehicle-rental interactions and reduce the need for customers to manually search through rental inventory or follow complicated booking forms.



