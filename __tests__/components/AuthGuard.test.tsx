import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthGuard } from "@/components/layout/AuthGuard";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockPathname = "/login";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => mockPathname,
}));

// onAuthChange is mocked in setup.ts — we need to control its callback
import { onAuthChange } from "@/lib/firebase/auth";

describe("AuthGuard — loading state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/login";
    // Return an immediately-resolving unsubscribe that never calls its callback
    vi.mocked(onAuthChange).mockReturnValue(() => {});
  });

  it("shows a spinner while auth state is loading", () => {
    const { container } = render(
      <AuthGuard><div>Protected</div></AuthGuard>
    );
    // The spinner SVG (or its container) should be in the DOM, not the children
    expect(container.querySelector("svg, .animate-spin") ?? container.querySelector("[class*='spinner']")).not.toBeNull();
    expect(screen.queryByText("Protected")).toBeNull();
  });
});

describe("AuthGuard — unauthenticated user on /login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/login";
    vi.mocked(onAuthChange).mockImplementation((cb) => {
      cb(null); // immediately unauthenticated
      return () => {};
    });
  });

  it("renders children on the login page when not logged in", async () => {
    render(
      <AuthGuard><div>Login Form</div></AuthGuard>
    );
    await waitFor(() => {
      expect(screen.getByText("Login Form")).toBeDefined();
    });
  });

  it("does NOT redirect when already on /login", async () => {
    render(
      <AuthGuard><div>Login</div></AuthGuard>
    );
    await waitFor(() => screen.getByText("Login"));
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe("AuthGuard — unauthenticated user on protected route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/practice";
    vi.mocked(onAuthChange).mockImplementation((cb) => {
      cb(null); // immediately unauthenticated
      return () => {};
    });
  });

  it("redirects to /login when not authenticated on protected route", async () => {
    render(
      <AuthGuard><div>Protected</div></AuthGuard>
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("renders nothing (not children) when unauthenticated on protected route", async () => {
    render(
      <AuthGuard><div>Protected Content</div></AuthGuard>
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });
    expect(screen.queryByText("Protected Content")).toBeNull();
  });
});

describe("AuthGuard — authenticated user", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockUser = { uid: "abc123", email: "test@test.com" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/practice";
    vi.mocked(onAuthChange).mockImplementation((cb) => {
      cb(mockUser);
      return () => {};
    });
  });

  it("renders children when user is authenticated", async () => {
    render(
      <AuthGuard><div>Dashboard</div></AuthGuard>
    );
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeDefined();
    });
  });

  it("does NOT redirect when user is authenticated", async () => {
    render(
      <AuthGuard><div>Page</div></AuthGuard>
    );
    await waitFor(() => screen.getByText("Page"));
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
