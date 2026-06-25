import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProblemForm } from "@/components/problems/problem-form";
import { createProblem, updateProblem } from "@/api/problems";
import { Difficulty } from "@cinp/api";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("@/api/problems", () => ({
  createProblem: jest.fn(),
  updateProblem: jest.fn(),
}));

jest.mock("@/hooks/use-monaco-editor", () => ({
  useMonacoEditor: () => ({
    containerRef: { current: null },
    isReady: true,
    loadError: null,
  }),
}));

const mockedCreateProblem = jest.mocked(createProblem);
const mockedUpdateProblem = jest.mocked(updateProblem);

describe("ProblemForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a problem with the entered details", async () => {
    const user = userEvent.setup();

    mockedCreateProblem.mockResolvedValue({
      id: "problem-1",
    } as never);

    render(<ProblemForm mode="create" />);

    await user.type(screen.getByLabelText("Titre"), "Two Sum");
    await user.type(screen.getByLabelText("Slug"), "two-sum");
    await user.type(
      screen.getByLabelText("Description"),
      "Find two numbers that add up to the target value.",
    );
    await user.click(
      screen.getByRole("button", { name: "Creer le probleme" }),
    );

    expect(mockedCreateProblem).toHaveBeenCalledWith({
      title: "Two Sum",
      slug: "two-sum",
      difficulty: Difficulty.EASY,
      description: "Find two numbers that add up to the target value.",
      examples: undefined,
      constraints: undefined,
      starterCode: undefined,
    });
    expect(push).toHaveBeenCalledWith("/problems/problem-1");
    expect(refresh).toHaveBeenCalled();
  });

  it("loads an existing problem and updates it", async () => {
    const user = userEvent.setup();

    mockedUpdateProblem.mockResolvedValue({
      id: "problem-2",
    } as never);

    render(
      <ProblemForm
        mode="edit"
        problem={{
          id: "problem-2",
          title: "Binary Search",
          slug: "binary-search",
          difficulty: Difficulty.MEDIUM,
          description:
            "Implement a binary search that returns the index of the target value.",
          examples: undefined,
          constraints: undefined,
          starterCode: undefined,
        } as never}
      />,
    );

    expect(screen.getByDisplayValue("Binary Search")).toBeInTheDocument();
    expect(screen.getByDisplayValue("binary-search")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Titre"));
    await user.type(screen.getByLabelText("Titre"), "Binary Search v2");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(mockedUpdateProblem).toHaveBeenCalledWith("problem-2", {
      title: "Binary Search v2",
      slug: "binary-search",
      difficulty: Difficulty.MEDIUM,
      description:
        "Implement a binary search that returns the index of the target value.",
      examples: undefined,
      constraints: undefined,
      starterCode: undefined,
    });
    expect(push).toHaveBeenCalledWith("/problems/problem-2");
    expect(refresh).toHaveBeenCalled();
  });
});
