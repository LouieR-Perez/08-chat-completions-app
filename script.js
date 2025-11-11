// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Store the conversation history
const conversation = [
  {
    role: 'system',
    content: 'You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. If a user\'s query is unrelated to budget travel, respond by stating that you do not know.'
  }
];

// Listen for form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the page from reloading

  // Get the user's input
  const userMessage = userInput.value;
  if (!userMessage.trim()) return;

  // Clear the input field immediately
  userInput.value = '';

  // Add the user's message to the conversation history
  conversation.push({ role: 'user', content: userMessage });

  // Show a loading message
  responseContainer.textContent = 'Thinking...';

  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversation,
        max_completion_tokens: 800,
        temperature: 0.5,
        frequency_penalty: 0.8,
      })
    });

    // Parse the response data
    const result = await response.json();
    const aiMessage = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content
      ? result.choices[0].message.content
      : 'Sorry, I could not get a response.';

    // Add the AI's response to the conversation history
    conversation.push({ role: 'assistant', content: aiMessage });

    // Display the AI's response, preserving line breaks
    responseContainer.textContent = '';
    responseContainer.innerText = aiMessage;
  } catch (error) {
    // Log the error and show a user-friendly message
    console.error('API request failed:', error);
    responseContainer.textContent = 'Sorry, something went wrong. Please try again.';
  }
});