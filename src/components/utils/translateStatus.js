export const translateStatus = status => {
  switch (status) {
    case "in-progress":
      return "en cours";
    case "ended":
      return "terminé";
    case "pending":
      return "en attente";
    default:
      return status;
  }
};
