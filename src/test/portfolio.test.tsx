import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import App from "../App";
import { Publications } from "../components/Publications";
import { publications } from "../content/publications";
import { profile } from "../content/profile";
import { bibtex } from "../lib";

describe("Academic portfolio visitor workflows", () => {
  it("combines Scholar interest, year, and type filters and recovers from an empty selection", async () => {
    const user = userEvent.setup();
    render(<Publications resetKey={0} />);
    expect(screen.getAllByRole("article")).toHaveLength(publications.length);
    await user.click(screen.getByRole("button", { name: "Robotics" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        name: /Automation in bridge deck inspection/,
      }),
    ).toBeTruthy();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication type" }),
      "Journal article",
    );
    expect(screen.getByText("No publications in this selection.")).toBeTruthy();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication type" }),
      "Book chapter",
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication year" }),
      "2023",
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("No publications in this selection.")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: /Show all publications/ }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(publications.length);
    expect(
      (
        screen.getByRole("combobox", {
          name: "Publication type",
        }) as HTMLSelectElement
      ).value,
    ).toBe("all");
  });
  it("exports a real verified citation and copies it to the clipboard", async () => {
    const user = userEvent.setup();
    render(<Publications resetKey={0} />);
    await user.click(
      screen.getByRole("button", {
        name: `View BibTeX for ${publications.find((p) => p.id === "intrinsic-2024")!.title}`,
      }),
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(
      (within(dialog).getByRole("textbox") as HTMLTextAreaElement).value,
    ).toContain("10.1145/3663652.3663654");
    await user.click(
      within(dialog).getByRole("button", { name: "Copy BibTeX" }),
    );
    expect(await navigator.clipboard.readText()).toContain(
      "Hadi, Abir Mohammad",
    );
    expect(within(dialog).getByRole("status").textContent).toBe(
      "Citation copied.",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Close citation" }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("persists a theme choice and restores mobile menu focus after Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(localStorage.getItem("ah-theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    await user.click(toggle);
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });
  it("makes the complete identity and research discoverable without JavaScript, with valid anchors", () => {
    const html = renderToString(<App />);
    expect(html).toContain(profile.name);
    expect(html).toContain(profile.direction);
    render(<App />);
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#"))
        expect(
          document.getElementById(href.slice(1)),
          `Missing anchor ${href}`,
        ).toBeTruthy();
    }
    expect(screen.queryByRole("link", { name: /Download CV/ })).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /News & updates/ }),
    ).toBeNull();
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });
  it("suppresses citation export when metadata is incomplete", () => {
    expect(
      bibtex({ ...publications[0], metadata: "incomplete" }),
    ).toBeUndefined();
    expect(bibtex({ ...publications[0], authors: undefined })).toBeUndefined();
  });
  it("exports chapters, dissertations, posters, and article numbers with the appropriate citation fields", () => {
    const citation = (id: string) =>
      bibtex(publications.find((p) => p.id === id)!)!;
    expect(citation("bridge-inspection-2026")).toContain("@incollection{");
    expect(citation("bridge-inspection-2026")).toContain(
      "booktitle = {Moving Toward Smart, Resilient and Sustainable Bridges}",
    );
    expect(citation("dissertation-2025")).toContain("@phdthesis{");
    expect(citation("dissertation-2025")).toContain(
      "school = {South Dakota State University}",
    );
    expect(citation("task-pruning-poster-2022")).toContain("@misc{");
    expect(citation("task-pruning-poster-2022")).toContain(
      "howpublished = {Poster presented at",
    );
    expect(citation("soil-compaction-2026")).toContain("eid = {197}");
    expect(citation("soil-compaction-2026")).not.toContain("pages = {197}");
  });
  it("resets publication filters when a related project link is followed", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Publications resetKey={0} />);
    await user.click(screen.getByRole("button", { name: "Robotics" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    rerender(<Publications resetKey={1} />);
    expect(screen.getAllByRole("article")).toHaveLength(publications.length);
  });
});
