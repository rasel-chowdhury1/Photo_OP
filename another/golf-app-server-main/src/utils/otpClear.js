// const clearOtpAfterOneMinute = (user) => {
//     setTimeout(async () => {
//         try {
//             user.oneTimeCode = null; // Clear the OTP
//             await user.save(); // Save the updated user data
//             console.log("One-time code cleared after 1 minute");
//         } catch (error) {
//             console.error("Error clearing one-time code", error);
//         }
//     }, 3 * 60 * 1000); // 1 minute in milliseconds
// };

// module.exports=clearOtpAfterOneMinute
const clearOtpAfterThreeMinutes = (user) => {
    setTimeout(async () => {
        try {
           
            user.oneTimeCode = null; // Clear the OTP
            await user.save(); // Save the updated user data
            console.log("One-time code cleared after 3 minutes");
        } catch (error) {
            console.error("Error clearing one-time code", error);
        }
    }, 3* 60 * 1000); // 3 minutes in milliseconds
};

module.exports = clearOtpAfterThreeMinutes;
