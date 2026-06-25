import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmDialog } from "@/components/customs/confirm-dialog";
import { DeleteProblemButton } from "@/components/problems/delete-problem-button";
import { deleteProblem } from "@/api/problems";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("@/api/problems", () => ({
  deleteProblem: jest.fn(),
}));

jest.mock("@/components/customs/confirm-dialog", () => ({
  ConfirmDialog: {
    call: jest.fn(),
  },
}));

const mockedDeleteProblem = jest.mocked(deleteProblem);
const mockedConfirmDialog = jest.mocked(ConfirmDialog.call);

describe("DeleteProblemButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("asks for confirmation before deleting the problem", async () => {
    const user = userEvent.setup();

    mockedConfirmDialog.mockResolvedValue(true);
    mockedDeleteProblem.mockResolvedValue(undefined);

    render(<DeleteProblemButton problemId="problem-1" />);

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(mockedConfirmDialog).toHaveBeenCalledWith({
      title: "Supprimer ce probleme ?",
      description: "Cette action est definitive.",
      confirmLabel: "Supprimer",
    });
    expect(mockedDeleteProblem).toHaveBeenCalledWith("problem-1");
    expect(push).toHaveBeenCalledWith("/problems");
    expect(refresh).toHaveBeenCalled();
  });

  it("does not delete when the confirmation is declined", async () => {
    const user = userEvent.setup();

    mockedConfirmDialog.mockResolvedValue(false);

    render(<DeleteProblemButton problemId="problem-1" />);

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(mockedDeleteProblem).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });
});
