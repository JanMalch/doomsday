import { doomsdayMethod, Weekday } from "@/doomsday-method";

describe("doomsdayMethod", () => {
  it("should return null for invalid dates", () => {
    expect(doomsdayMethod(new Date(Number.NaN))).toBeNull();
  });

  it("should calculate the weekdays correctly", () => {
    const startOfEpoch = new Date(0);
    const result = doomsdayMethod(startOfEpoch);
    expect(result).toBeDefined();
    expect(result?.result).toBe(Weekday.Thursday);
  });
});
