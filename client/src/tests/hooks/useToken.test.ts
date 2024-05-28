import { renderHook } from "@testing-library/react";
import { act } from "react";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { useToken } from "../../hooks/useToken";
import { jwtDecode } from "jwt-decode";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("testing the useToken custom hook", () => {
  const mockSetToken = vi.fn();

  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => (store[key] = value),
      removeItem: (key: string) => delete store[key],
      clear: () => (store = {}),
    };
  })();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  Object.defineProperty(window, "sessionStorage", { value: localStorageMock });

  const token = "mockToken";
  const decodedToken = {
    exp: Math.floor(Date.now() / 1000) + 60,
    rememberMe: true,
    id: "mockUserId",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(jwtDecode).mockImplementation(() => decodedToken);
    vi.spyOn(window.localStorage, "setItem");
    vi.spyOn(window.localStorage, "removeItem");
    vi.spyOn(window.sessionStorage, "setItem");
    vi.spyOn(window.sessionStorage, "removeItem");
  });

  describe("saveToken", () => {
    it("saves token to localStorage if rememberMe is true", () => {
      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.saveToken(token);
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "Token",
        JSON.stringify(token)
      );
    });

    it("saves token to sessionStorage if rememberMe is false", () => {
      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.saveToken(token);
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        "Token",
        JSON.stringify(token)
      );
    });
  });

  describe("checkToken", () => {
    it("should remove the token if it is expired", () => {
      vi.mocked(jwtDecode).mockReturnValue({
        ...decodedToken,
        exp: Math.floor(Date.now() / 1000) - 60,
      });
      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.checkToken(token);
      });

      expect(mockSetToken).toHaveBeenCalledWith("");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("Token");
    });

    it("should change nothing if the token is stil valid", () => {
      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.checkToken(token);
      });

      expect(mockSetToken).not.toHaveBeenCalled();
      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout and reload the window", () => {
      const mockReload = vi.fn();
      const { result } = renderHook(() => useToken(mockSetToken, mockReload));

      act(() => {
        result.current.logout(token);
      });

      expect(mockSetToken).toHaveBeenCalledWith("");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("Token");
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe("setTheToken", () => {
    it("sets token from localStorage if available", () => {
      window.localStorage.setItem("Token", JSON.stringify(token));

      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.setTheToken();
      });

      expect(mockSetToken).toHaveBeenCalledWith(token);
    });

    it("sets token from sessionStorage if available", () => {
      window.sessionStorage.setItem("Token", JSON.stringify(token));

      const { result } = renderHook(() => useToken(mockSetToken));

      act(() => {
        result.current.setTheToken();
      });

      expect(mockSetToken).toHaveBeenCalledWith(token);
    });
  });

  describe("getUserId", () => {
    it("shoul return the user id from the decoded token", () => {
      const { result } = renderHook(() => useToken(mockSetToken));

      const userId = result.current.getUserId(token);

      expect(userId).toBe(decodedToken.id);
    });

    it("should return null if no token is provided", () => {
      const { result } = renderHook(() => useToken(mockSetToken));

      const userId = result.current.getUserId("");

      expect(userId).toBeNull();
    });
  });
});
