# musica.srmacedo.com

Ferramentas para estudar guitarra. Site estático servido por um pequeno servidor Go.

- `/escalas`: escalas no braço da guitarra (várias afinações, canhoto, som de corda dedilhada).
- `/metronomo`: metrônomo com acentos, subdivisões, tap tempo e treino de velocidade.
- `/backing-track`: bateria, baixo e acordes no tom e na progressão escolhidos.

Os samples são todos CC0: bateria e baixo da Karoryfer Samples, piano da VCSL. A origem de cada arquivo está no `README.md` de cada pasta em `static/audio/`.

## Desenvolvimento

```bash
bin/dev              # servidor com reload em http://localhost:8080
bin/version-assets   # rode depois de mudar qualquer arquivo em static/css ou static/js
```

Deploy: veja [deploy/README.md](deploy/README.md).
