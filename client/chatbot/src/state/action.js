// actions.js

export const updateToken = (token) => ({
  type: 'UPDATE_TOKEN',
  payload: token,
});

export const updateAdminId = (adminId) => ({
  type: 'UPDATE_ADMIN_ID',
  payload: adminId,
});

export const updateChatbotLink = (chatbotLinks) => ({
  type: 'UPDATE_CHATBOT_LINK',
  payload: chatbotLinks,
});