import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>hello</Card>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies default md padding", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c").className).toMatch(/p-5/);
  });

  it("applies sm padding when specified", () => {
    render(
      <Card data-testid="c" padding="sm">
        x
      </Card>,
    );
    expect(screen.getByTestId("c").className).toMatch(/p-3/);
  });

  it("applies hover shadow when interactive", () => {
    render(
      <Card data-testid="c" interactive>
        x
      </Card>,
    );
    expect(screen.getByTestId("c").className).toMatch(/hover:shadow-md/);
  });
});
