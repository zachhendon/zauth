import App from "./App.jsx";
import { render } from "./utils/test-utils.jsx";
import { screen } from "@testing-library/dom";

describe("Basic test", () => {
  test("Should show title", () => {
    render(<App />);
    expect(screen.getByText(/todo app/i)).toBeDefined();
  });
  test("Should show api response", async () => {
    render(<App />);
    expect(await screen.findByText(/api is working properly!/i)).toBeDefined();
  });
});
