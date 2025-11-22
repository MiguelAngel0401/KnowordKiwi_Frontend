import privateApiClient from "@/services/client/privateApiClient";
import { ProfileFormData, UserProfileResponse } from "@/types/users";

export const getMe = async (): Promise<UserProfileResponse> => {
  try {
    const response =
      await privateApiClient.get<UserProfileResponse>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserData = async (
  data: ProfileFormData,
): Promise<UserProfileResponse> => {
  try {
    const response = await privateApiClient.patch<UserProfileResponse>(
      "/users/me",
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
