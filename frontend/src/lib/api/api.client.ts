import * as authRequests from "./requests/auth/auth.requests";
import * as carsRequests from "./requests/cars/cars.requests";

const apiClient = {
  auth: authRequests,
  cars: carsRequests,
};

export default apiClient;
