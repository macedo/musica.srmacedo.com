// Utilidades compartilhadas entre as ferramentas: atalho de DOM, toast e compartilhamento.
window.App = (() => {
  const $ = (id) => document.getElementById(id);

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast.id);
    toast.id = setTimeout(() => (t.hidden = true), 2000);
  }

  async function share({ title, text, path }) {
    const url = `${location.origin}${path}`;
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast('Link copiado!');
      }
    } catch {
      /* usuário cancelou */
    }
  }

  return { $, toast, share };
})();
