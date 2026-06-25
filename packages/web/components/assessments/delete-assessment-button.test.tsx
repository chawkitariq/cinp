import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmDialog } from "@/components/customs/confirm-dialog";
import { DeleteAssessmentButton } from "@/components/assessments/delete-assessment-button";
import { deleteAssessment } from "@/api/assessments";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("@/api/assessments", () => ({
  deleteAssessment: jest.fn(),
}));

jest.mock("@/components/customs/confirm-dialog", () => ({
  ConfirmDialog: {
    call: jest.fn(),
  },
}));

const mockedDeleteAssessment = jest.mocked(deleteAssessment);
const mockedConfirmDialog = jest.mocked(ConfirmDialog.call);

describe("DeleteAssessmentButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("asks for confirmation before deleting the assessment", async () => {
    const user = userEvent.setup();

    mockedConfirmDialog.mockResolvedValue(true);
    mockedDeleteAssessment.mockResolvedValue(undefined);

    render(<DeleteAssessmentButton assessmentId="assessment-1" />);

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(mockedConfirmDialog).toHaveBeenCalledWith({
      title: "Supprimer cette evaluation ?",
      description: "Cette action est definitive.",
      confirmLabel: "Supprimer",
    });
    expect(mockedDeleteAssessment).toHaveBeenCalledWith("assessment-1");
    expect(push).toHaveBeenCalledWith("/assessments");
    expect(refresh).toHaveBeenCalled();
  });

  it("does not delete when the confirmation is declined", async () => {
    const user = userEvent.setup();

    mockedConfirmDialog.mockResolvedValue(false);

    render(<DeleteAssessmentButton assessmentId="assessment-1" />);

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(mockedDeleteAssessment).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });
});
