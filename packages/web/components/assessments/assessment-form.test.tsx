import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AssessmentForm } from "@/components/assessments/assessment-form";
import { createAssessment, updateAssessment } from "@/api/assessments";
import { AssessmentStatus } from "@cinp/api";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("@/api/assessments", () => ({
  createAssessment: jest.fn(),
  updateAssessment: jest.fn(),
}));

const mockedCreateAssessment = jest.mocked(createAssessment);
const mockedUpdateAssessment = jest.mocked(updateAssessment);

const availableProblems = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Problem backend",
    slug: "problem-backend",
    difficulty: "EASY",
    description: "Resoudre un probleme backend simple.",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Problem frontend",
    slug: "problem-frontend",
    difficulty: "MEDIUM",
    description: "Resoudre un probleme frontend plus complet.",
  },
] as never;

describe("AssessmentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an assessment with the entered details", async () => {
    const user = userEvent.setup();

    mockedCreateAssessment.mockResolvedValue({
      id: "assessment-1",
    } as never);

    render(<AssessmentForm availableProblems={availableProblems} mode="create" />);

    await user.type(screen.getByLabelText("Titre"), "Evaluation frontend");
    await user.clear(screen.getByLabelText("Duree (minutes)"));
    await user.type(screen.getByLabelText("Duree (minutes)"), "90");
    await user.type(
      screen.getByLabelText("Description"),
      "Verifier la qualite du flux frontend.",
    );
    await user.click(
      screen.getByRole("checkbox", { name: /Problem backend/i }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /Problem frontend/i }),
    );
    await user.click(
      screen.getByRole("button", { name: "Creer une evaluation" }),
    );

    expect(mockedCreateAssessment).toHaveBeenCalledWith({
      title: "Evaluation frontend",
      description: "Verifier la qualite du flux frontend.",
      durationMin: 90,
      status: AssessmentStatus.DRAFT,
      problemIds: [
        "11111111-1111-4111-8111-111111111111",
        "22222222-2222-4222-8222-222222222222",
      ],
    });
    expect(push).toHaveBeenCalledWith("/assessments/assessment-1");
    expect(refresh).toHaveBeenCalled();
  });

  it("loads an existing assessment and updates it", async () => {
    const user = userEvent.setup();

    mockedUpdateAssessment.mockResolvedValue({
      id: "assessment-2",
    } as never);

    render(
      <AssessmentForm
        availableProblems={availableProblems}
        assessment={{
          id: "assessment-2",
          title: "Evaluation backend",
          description: "Version de base.",
          durationMin: 45,
          status: AssessmentStatus.ACTIVE,
          problems: [
            { problemId: "22222222-2222-4222-8222-222222222222" },
          ],
        } as never}
        mode="edit"
      />,
    );

    expect(screen.getByDisplayValue("Evaluation backend")).toBeInTheDocument();
    expect(screen.getByDisplayValue("45")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Problem frontend/i }),
    ).toBeChecked();

    await user.clear(screen.getByLabelText("Titre"));
    await user.type(screen.getByLabelText("Titre"), "Evaluation backend v2");
    await user.click(
      screen.getByRole("button", { name: "Enregistrer" }),
    );

    expect(mockedUpdateAssessment).toHaveBeenCalledWith("assessment-2", {
      title: "Evaluation backend v2",
      description: "Version de base.",
      durationMin: 45,
      status: AssessmentStatus.ACTIVE,
      problemIds: ["22222222-2222-4222-8222-222222222222"],
    });
    expect(push).toHaveBeenCalledWith("/assessments/assessment-2");
    expect(refresh).toHaveBeenCalled();
  });
});
