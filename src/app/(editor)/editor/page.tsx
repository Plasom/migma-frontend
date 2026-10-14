import { EditorEngine } from '@/features/editor/EditorEngine';
import { EditorShell } from '@/features/editor/EditorShell';

export default function Page() {
  return (
    <>
      <title>Migma</title>
      <EditorShell />
      <EditorEngine />
    </>
  );
}
