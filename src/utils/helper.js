// "0001-01-01T00:00:00Z" to "yyyy-mm-dd"
export function convertDateOnly(dateTimeString) {
   return dateTimeString.split("T")[0];
}

// "yyyy-mm-dd" to "0001-01-01T00:00:00Z"
export function convertDateTimeString(dateOnlyString) {
   const date = new Date(dateOnlyString);
   return date.toISOString();
}
export const convertWithMonthName = (date) => {
   const month = new Date(date).toLocaleString("default", { month: "long"})
   const dateSplt = convertDateOnly(date).split("-")
   return `${dateSplt[2]}-${month}-${dateSplt[0]}`
}

export const timeAgo = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const diff = now - date;

   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
       return `${days} day${days > 1 ? 's' : ''} ago`;
   } else if (hours > 0) {
       return `${hours} hour${hours > 1 ? 's' : ''} ago`;
   } else if (minutes > 0) {
       return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
   } else {
       return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
   }
}