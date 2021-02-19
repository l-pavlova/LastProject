
const api = {
    //userControler
    getUser: userId => `/users/${userId}`,
    getUserByEmail: userEmail => `/auth/email/${userEmail}`,
    addUser: () => `/auth/register`,
    logginUser: () => `/users/login`,
    getFriend: friendId => `/users/friend/${friendId}`,
    getFriends: () => `/users/all`,
    getFriendsList: friendId  => `/users//friends/${friendId}`,
    //MessagingControler
    getChat: chatId => `/messages/${chatId}`,
    sendMessage: () => `/messages/sendMessage`,
}

export default api;
