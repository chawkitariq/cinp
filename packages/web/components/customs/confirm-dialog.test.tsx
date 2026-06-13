import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmDialog } from "@/components/customs/confirm-dialog";

function callConfirmDialog(
  props: Partial<Parameters<typeof ConfirmDialog.call>[0]> = {},
) {
  let response: Promise<boolean> | undefined;

  act(() => {
    response = ConfirmDialog.call({
      title: "Supprimer ce probleme ?",
      description: "Cette action est definitive.",
      ...props,
    });
  });

  if (!response) {
    throw new Error("ConfirmDialog.call did not return a response promise.");
  }

  return response;
}

describe("ConfirmDialog", () => {
  it("renders the requested confirmation content and focuses the cancel action", async () => {
    render(<ConfirmDialog />);

    const response = callConfirmDialog({
      confirmLabel: "Supprimer",
    });

    expect(
      await screen.findByRole("dialog", {
        name: "Supprimer ce probleme ?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cette action est definitive.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Annuler" }),
    ).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Supprimer" }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));

    await expect(response).resolves.toBe(false);
  });

  it("resolves true when the user confirms", async () => {
    render(<ConfirmDialog />);

    const response = callConfirmDialog({
      confirmLabel: "Supprimer",
    });

    await userEvent.click(
      await screen.findByRole("button", { name: "Supprimer" }),
    );

    await expect(response).resolves.toBe(true);
  });

  it("resolves false when the user cancels", async () => {
    render(<ConfirmDialog />);

    const response = callConfirmDialog();

    await userEvent.click(
      await screen.findByRole("button", { name: "Annuler" }),
    );

    await expect(response).resolves.toBe(false);
  });

  it("resolves false when the dialog is dismissed", async () => {
    const user = userEvent.setup();

    render(<ConfirmDialog />);

    const response = callConfirmDialog();

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await expect(response).resolves.toBe(false);
  });
});
