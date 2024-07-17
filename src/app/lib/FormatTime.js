 export const formatTime = (createdAt) => {
    const now = Date.now();
    const elapsedMinutes = Math.round((now - createdAt) / 60000);
    const elapsedHours = Math.round(elapsedMinutes / 60);
    const elapsedDays = Math.round(elapsedHours / 24);
    const elapsedWeeks = Math.round(elapsedDays / 7);

    if (elapsedMinutes === 0) {
      return 'Just now';
    } else if (elapsedMinutes < 60) {
      return `${elapsedMinutes} min`;
    } else if (elapsedHours < 24) {
      return `${elapsedHours} hr`;
    } else if (elapsedDays === 1) {
      return 'Yesterday';
    } else if (elapsedDays < 7) {
      return new Date(createdAt).toLocaleDateString("en-IN", {
        weekday: "long"
      });
    } else if (elapsedWeeks < 1) {
      return new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } else {
      return new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
  };

 export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      // Manually format the date as dd MMM yyyy
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
  };