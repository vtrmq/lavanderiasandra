export function formatearFechaHora(input?: string) {
  if (!input) return { fecha: '', hora: '' };

  const [fecha, tiempo] = input.split(' ');
  const [y, m, d] = fecha.split('-');
  const [h, min] = tiempo.split(':');

  const hour = Number(h);
  const isPM = hour >= 12;
  const hour12 = hour % 12 || 12;

  return {
    fecha: `${d}/${m}/${y}`,
    hora: `${String(hour12).padStart(2, '0')}:${min} ${isPM ? 'PM' : 'AM'}`
  };
}

export function filtrarParametros(url: string, parametros: Array<string>): string { // Array<string> -> string[]
  const urlObj = new URL(url);
  const params = new URLSearchParams();
  
  parametros.forEach(param => {
    if (urlObj.searchParams.has(param)) {
      params.append(param, urlObj.searchParams.get(param)!);
    }
  });
  
  return params.toString() ? `${params.toString()}` : '';
}
