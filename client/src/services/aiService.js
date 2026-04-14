const axios = require("axios");

const generatePlan = async (userInput) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a smart academic planner AI."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { generatePlan };