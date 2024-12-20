# Gemini API chat app

## Table of Contents

- [Intro](#intro)
- [Installation](#installation)
  - [Python installation](#option-2-python-installation)
- [Run the app](#run-the-app)
  - [Run the React client](#run-the-react-client)
  - [Run a backend server](#run-a-backend-server)
    - [Get an API key](#get-an-api-key)
    - [Configure and run the Python backend](#option-2-configure-and-run-the-python-backend)
- [Usage](#usage)
- [API documentation](#api-documentation)

## Intro

This example app lets the user chat with the Gemini API and use it as a personal
AI assistant. The app supports text-only chat in two modes: non-streaming and
streaming.

In non-streaming mode, a response is returned after the model completes the
entire text generation process.

Streaming mode uses the Gemini API's streaming capability to achieve faster
interactions.

### Frontend

The client for this app is written using [React](https://react.dev/) and served
using [Vite](https://github.com/vitejs/vite).

### Backend

There are three implementations of the backend server to choose from:

* A Python [Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)
  server, which demonstrates the
  [Gemini API Python SDK](https://github.com/google-gemini/generative-ai-python)
* A Node.js server, which demonstrates the
  [Gemini API JavaScript SDK](https://github.com/google-gemini/generative-ai-js)
* A Go server, which demonstrates the
  [Gemini API Go SDK](https://github.com/google/generative-ai-go)

You only need to install and run *one* of the backends. If you want to try more
than one, keep in mind that they all default to running on the same port.

## Installation

Follow the installation instructions for one of the backend servers (Node.js,
Python, or Go).

### Python installation

Before running the installation steps, make sure that Python 3.9+ is installed
in your development environment. Then navigate to the app directory,
`server-python`, and complete the installation.

#### Create a virtual environment

##### Linux/macOS

```
python -m venv venv
source venv/bin/activate
```

##### Windows

```
python -m venv venv
.\venv\Scripts\activate
```

#### Install the required Python packages

##### Linux/macOS/Windows

```
pip install -r requirements.txt
```


## Run the app

To launch the app:

1. Run the React client
2. Run the backend server of your choice

### Run the React client

1. Navigate to the app directory, `client-react/`.
2. Run the application with the following command:

   ```
   npm run start
   ```

The client will start on `localhost:3000`.

### Run a backend server

To run the backend, you need to get an API key and then follow the
configure-and-run instructions for *one* of the backend servers (Node.js,
Python, or Go).

#### Get an API Key

Before you can use the Gemini API, you must first obtain an API key. If you
don't already have one, create a key with one click in Google AI Studio.  

<a class=button button-primary href=https://ai.google.dev/gemini-api/docs/api-key target=_blank rel=noopener noreferrer>Get an API key</a>

#### Configure and run the Python backend

Configure the Python app:

1. Navigate to the app directory, `server-python/`.
2. Make sure that you've activated the virtual environment as shown in the
   installation steps.
3. Copy the `.env.example` file to `.env`.

   ```
   cp .env.example .env
   ```
4. Specify the Gemini API key for the variable `GOOGLE_API_KEY` in the `.env`
   file.

   ```
   GOOGLE_API_KEY=<your_api_key>
   ```

Run the Python app:

```
python app.py
```
The server will start on `localhost:9000`.

## Usage

To start using the app, visit [http://localhost:3000](http://localhost:3000/)

## API documentation

The following table shows the endpoints available in the example app:

<table class="responsive fixed orange">
  <colgroup><col width="214px"><col></colgroup>
  <tr>
    <th><h3 class="add-link">Endpoint</h3></th>
    <th><h3 class="add-link">Details</h3></th>
  </tr>
  <tr>
    <td>
      <code>chat/</code>
    </td>
    <td>
      This is the <b>non-streaming</b> POST method route. Use this to send the
      chat message and the history of the conversation to the Gemini model. The
      complete response generated by the model to the posted message will be
      returned in the API's response.
      <br />
      <br />
      <code>POST</code> <code><b>chat/</b></code>
      <h4>Parameters</h4>
      <table class="responsive fixed orange">
        <tr>
          <td><h5>Name</h5></td>
          <td><h5>Type</h5></td>
          <td><h5>Data type</h5></td>
          <td><h5>Description</h5></td>
        </tr>
        <tr>
          <td>chat</td>
          <td>required</td>
          <td>string</td>
          <td>Latest chat message from user</td>
        </tr>
        <tr>
          <td>history</td>
          <td>optional</td>
          <td>array</td>
          <td>Current chat history between user and Gemini model</td>
        </tr>
      </table>
      <h4>Response</h4>
      <table class="responsive fixed orange">
        <tr>
          <td><h5>HTTP code</h5></td>
          <td><h5>Content-Type</h5></td>
          <td><h5>Response</h5></td>
        </tr>
        <tr>
          <td>200</td>
          <td>application/json</td>
          <td>{"text": string}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <code>stream/</code>
    </td>
    <td>
      This is the <b>streaming</b> POST method route. Use this to send the chat
      message and the history of the conversation to the Gemini model. The
      response generated by the model will be streamed to handle partial
      results.  
      <br />
      <br />
      <code>POST</code> <code><b>stream/</b></code>
      <h4>Parameters</h4>
      <table class="responsive fixed orange">
        <tr>
          <td><h5>Name</h5></td>
          <td><h5>Type</h5></td>
          <td><h5>Data type</h5></td>
          <td><h5>Description</h5></td>
        </tr>
        <tr>
          <td>chat</td>
          <td>required</td>
          <td>string</td>
          <td>Latest chat message from user</td>
        </tr>
        <tr>
          <td>history</td>
          <td>optional</td>
          <td>array</td>
          <td>Current chat history between user and Gemini model</td>
        </tr>
      </table>
      <h4>Response</h4>
      <table class="responsive fixed orange">
        <tr>
          <td><h5>HTTP code</h5></td>
          <td><h5>Content-Type</h5></td>
          <td><h5>Response</h5></td>
        </tr>
        <tr>
          <td>200</td>
          <td>application/json</td>
          <td>string</td>
        </tr>
      </table>
    </td>
  </tr>
</table>