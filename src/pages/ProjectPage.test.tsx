import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import i18n from '../i18n';
import { ProjectPage } from './ProjectPage';
import { PROJECTS } from '../content/projects';

/**
 * End-to-end smoke cover for the content-layer migration: a project now has to
 * resolve from `src/content` through `useProject` and render, with no
 * `returnObjects` cast anywhere in the path.
 */
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const firstProject = PROJECTS[0];

describe('ProjectPage', () => {
  it('renders a known project with its title and metadata', async () => {
    await i18n.changeLanguage('pt');
    renderAt(`/projects/${firstProject.slug}`);

    expect(
      screen.getByRole('heading', { level: 1, name: firstProject.locales.pt.title }),
    ).toBeInTheDocument();
  });

  it('renders section headings from the fast lane by default', async () => {
    await i18n.changeLanguage('pt');
    renderAt(`/projects/${firstProject.slug}`);

    const firstHeading = firstProject.locales.pt.fastLane[0].heading;
    expect(screen.getByRole('heading', { name: firstHeading })).toBeInTheDocument();
  });

  it('renders the localized title after switching language', async () => {
    await i18n.changeLanguage('en');
    renderAt(`/projects/${firstProject.slug}`);

    expect(
      screen.getByRole('heading', { level: 1, name: firstProject.locales.en.title }),
    ).toBeInTheDocument();

    await i18n.changeLanguage('pt');
  });

  it('shows a translated not-found state for an unknown slug', async () => {
    await i18n.changeLanguage('pt');
    renderAt('/projects/does-not-exist');

    // Must be the translated copy, not a raw i18n key and not English.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Projeto não encontrado',
    );
  });

  it('does not leak an untranslated i18n key into the not-found state', async () => {
    await i18n.changeLanguage('pt');
    const { container } = renderAt('/projects/does-not-exist');
    expect(container.textContent).not.toContain('projects.notFound');
  });
});
