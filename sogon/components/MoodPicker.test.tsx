import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodPicker } from "./MoodPicker";

describe("MoodPicker", () => {
  it("renders all five mood buttons with Korean labels", () => {
    render(<MoodPicker value={null} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "좋음" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "평온" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "슬픔" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "짜증" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "피곤" })).toBeInTheDocument();
  });

  it("shows '(선택)' hint when no mood is picked", () => {
    render(<MoodPicker value={null} onChange={() => {}} />);
    expect(screen.getByText("(선택)")).toBeInTheDocument();
  });

  it("hides the '(선택)' hint once a mood is picked", () => {
    render(<MoodPicker value="calm" onChange={() => {}} />);
    expect(screen.queryByText("(선택)")).not.toBeInTheDocument();
  });

  it("marks only the selected mood as pressed", () => {
    render(<MoodPicker value="calm" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "평온" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "좋음" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the mood when an unselected button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodPicker value={null} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "좋음" }));

    expect(onChange).toHaveBeenCalledWith("happy");
  });

  it("calls onChange(null) when the currently selected button is clicked again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodPicker value="calm" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "평온" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("calls onChange with the new mood when a different button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodPicker value="calm" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "슬픔" }));

    expect(onChange).toHaveBeenCalledWith("sad");
  });
});
