export interface UserSettings {
  aiEnabled: boolean;
  onboardingCompleted?: boolean;
}

export interface UpdateUserSettingsDto {
  aiEnabled?: boolean;
}
