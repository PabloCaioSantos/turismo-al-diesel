from .models import Categoria, Passeio

CATEGORIAS: list[dict[str, str]] = [
    {"slug": "praias", "label": "Praias"},
    {"slug": "trilhas", "label": "Trilhas"},
    {"slug": "museus", "label": "Museus"},
    {"slug": "gastronomia", "label": "Gastronomia"},
    {"slug": "historicos", "label": "Passeios Históricos"},
    {"slug": "ecoturismo", "label": "Ecoturismo"},
]

_PASSEIO_DIR = "/public/assets/images/passeios"
_CATEGORIA_DIR = "/public/assets/images/categorias"


def build_categorias() -> list[Categoria]:
    return [Categoria(slug=c["slug"], label=c["label"]) for c in CATEGORIAS]


PASSEIOS_SEED: list[dict] = [
    {
        "id": 1,
        "nome": "Praia da Lagoinha",
        "categorias": ["praias", "ecoturismo", "trilhas"],
        "valorEstimado": 120,
        "descricao": "Considerada uma das praias mais belas do Ceará, em Paraipaba: enseada em meia-lua cercada por dunas amarelas, falésias e coqueiral com bicas de água doce.",
        "detalhes": "Passeio pela vila de Lagoinha, no alto da falésia, com vista do mirante natural para a enseada. Inclui a larga faixa de areia de mar calmo, passeio de jangada com os pescadores e opções de buggy e quadriciclo pelas dunas.",
        "duracao": "Dia inteiro (aprox. 8h)",
        "nota": 4.9,
        "numAvaliacoes": 512,
        "local": {"endereco": "Lagoinha, Paraipaba/CE", "lat": -3.3167, "lng": -39.25},
    },
    {
        "id": 3,
        "nome": "Praia da Taíba",
        "categorias": ["praias", "ecoturismo", "trilhas"],
        "valorEstimado": 110,
        "descricao": "Em São Gonçalo do Amarante, 10 km de areia larga cercada por dunas e falésias de arenito, com clima de vila e vibe solar.",
        "detalhes": "Caminhada pela orla e pelo Morro do Chapéu, banho de mar e visita às falésias. De julho a janeiro o vento constante faz da Taíba um dos melhores points de kitesurf do mundo, sede de etapas da GKA Kite World Cup.",
        "duracao": "Dia inteiro",
        "nota": 4.8,
        "numAvaliacoes": 356,
        "local": {"endereco": "Taíba, São Gonçalo do Amarante/CE", "lat": -3.49, "lng": -38.92},
    },
    {
        "id": 6,
        "nome": "Barra do Rio Curu",
        "categorias": ["praias", "ecoturismo", "trilhas"],
        "valorEstimado": 85,
        "descricao": "Encontro do rio Curu com o mar, na divisa de Paracuru: mangue, foz e água calma para caiaque e stand-up paddle.",
        "detalhes": "Passeio de barco ou caiaque pela foz do rio Curu, observação do manguezal e das aves, e banho na barra onde o rio se encontra com o oceano. Ótimo para pôr do sol.",
        "duracao": "Meio período",
        "nota": 4.5,
        "numAvaliacoes": 156,
        "local": {"endereco": "Barra do Curu, Paracuru/CE", "lat": -3.43, "lng": -39.1},
    },
    {
        "id": 8,
        "nome": "Lagoa do Banana",
        "categorias": ["ecoturismo", "praias", "trilhas"],
        "valorEstimado": 90,
        "descricao": "Lagoa cercada por dunas e vegetação na Taíba, point de kite para iniciantes e passeio de quadriciclo.",
        "detalhes": "Dia na Lagoa do Banana com águas tranquilas, tirolesa sobre a lagoa, quadriciclo e caiaque pelas dunas. Ambiente perfeito para relaxar e aprender esportes de vento em água plana.",
        "duracao": "Meio período",
        "nota": 4.7,
        "numAvaliacoes": 168,
        "local": {"endereco": "Lagoa do Banana, Taíba/CE", "lat": -3.5, "lng": -38.9},
    },
    {
        "id": 10,
        "nome": "Pesca Esportiva no Açude de Pentecoste",
        "categorias": ["ecoturismo", "gastronomia"],
        "valorEstimado": 150,
        "descricao": "Um dos melhores pesqueiros do Ceará para tucunaré, com tilápias acima de 2 kg e traíras, a cerca de 1h30 de Fortaleza.",
        "detalhes": "Day trip de pesca esportiva com barco e guia local no açude Pereira de Miranda. Pesca de tucunaré, tilápia e traíra, seguida de almoço com o peixe fresco da região.",
        "duracao": "Dia inteiro (saída de madrugada)",
        "nota": 4.7,
        "numAvaliacoes": 142,
        "local": {"endereco": "Açude de Pentecoste/CE", "lat": -3.79, "lng": -39.27},
    },
    {
        "id": 11,
        "nome": "Açude General Sampaio",
        "categorias": ["ecoturismo", "historicos", "trilhas"],
        "valorEstimado": 70,
        "descricao": "No interior do Ceará, um marco da engenharia hídrica, construído nos anos 1930 e ainda em operação.",
        "detalhes": "Visita ao açude General Sampaio, pioneiro na técnica de compactação mecanizada no país, com passeio de barco, pesca e a história do reservatório que deu origem à cidade e irriga os perímetros Curu-Paraipaba.",
        "duracao": "Meio período",
        "nota": 4.5,
        "numAvaliacoes": 98,
        "local": {
            "endereco": "Açude General Sampaio, General Sampaio/CE",
            "lat": -4.0447,
            "lng": -39.4472,
        },
    },
    {
        "id": 16,
        "nome": "Rota da Tilápia de Pentecoste",
        "categorias": ["gastronomia", "ecoturismo"],
        "valorEstimado": 90,
        "descricao": "Pentecoste é referência nacional em piscicultura: conheça os tanques-rede e prove a tilápia fresquíssima.",
        "detalhes": "Visita a uma criação de tilápia em tanques-rede no açude, explicação sobre a piscicultura sustentável e almoço com tilápia preparada de várias formas na beira da água.",
        "duracao": "Meio período",
        "nota": 4.7,
        "numAvaliacoes": 158,
        "local": {"endereco": "Pentecoste/CE", "lat": -3.79, "lng": -39.27},
    },
    {
        "id": 18,
        "nome": "Sabores da Taíba",
        "categorias": ["gastronomia", "praias"],
        "valorEstimado": 80,
        "descricao": "Moqueca, peixada e petiscos do mar nos restaurantes pé-na-areia da Taíba.",
        "detalhes": "Roteiro pelos restaurantes da vila da Taíba com moqueca de peixe, arroz de polvo e petiscos regionais, muitos com vista para os kitesurfistas. Fecha com tapioca ou cartola de sobremesa.",
        "duracao": "Meio período",
        "nota": 4.7,
        "numAvaliacoes": 173,
        "local": {"endereco": "Taíba, São Gonçalo do Amarante/CE", "lat": -3.49, "lng": -38.92},
    },
    {
        "id": 19,
        "nome": "Rota do Caju e da Castanha",
        "categorias": ["gastronomia", "historicos", "ecoturismo"],
        "valorEstimado": 60,
        "descricao": "A cajucultura é tradição no interior cearense: visita a cajueiros, beneficiamento da castanha e doces regionais.",
        "detalhes": "Passeio por um sítio de cajueiros com colheita (na safra), processo da castanha de caju, degustação de cajuína, doces e cachaça de caju. Cultura do sertão cearense na prática.",
        "duracao": "Meio período",
        "nota": 4.5,
        "numAvaliacoes": 89,
        "local": {"endereco": "Paraipaba/CE", "lat": -3.4386, "lng": -39.1467},
    },
    {
        "id": 21,
        "nome": "Igreja Matriz de N. S. da Porfíria",
        "categorias": ["historicos", "museus"],
        "valorEstimado": 25,
        "descricao": "Marco religioso e arquitetônico de Pentecoste, que remonta à fundação da cidade e reúne a comunidade.",
        "detalhes": "Visita guiada à Igreja Matriz de Nossa Senhora da Porfíria, no centro de Pentecoste, com sua arquitetura histórica, a praça em frente e a memória das festas e romarias do padroeiro.",
        "duracao": "1 a 2 horas",
        "nota": 4.6,
        "numAvaliacoes": 132,
        "local": {"endereco": "Centro, Pentecoste/CE", "lat": -3.7928, "lng": -39.2703},
    },
    {
        "id": 23,
        "nome": "Marco Histórico do Açude General Sampaio",
        "categorias": ["historicos", "ecoturismo", "museus"],
        "valorEstimado": 35,
        "descricao": "A obra que ergueu uma cidade: a história do açude pioneiro dos anos 1930 e da usina que iluminou o interior.",
        "detalhes": "Roteiro histórico pela barragem General Sampaio, a primeira do país com compactação mecanizada, e pela antiga usina hidrelétrica de 1961. Uma aula sobre o combate às secas e a engenharia hídrica do Ceará.",
        "duracao": "Meio período",
        "nota": 4.6,
        "numAvaliacoes": 71,
        "local": {"endereco": "General Sampaio/CE", "lat": -4.0447, "lng": -39.4472},
    },
    {
        "id": 24,
        "nome": "Memorial do Açude e da Seca",
        "categorias": ["museus", "historicos"],
        "valorEstimado": 20,
        "descricao": "Acervo sobre a história do rio Curu, os açudes e a convivência com a seca no sertão cearense.",
        "detalhes": "Espaço de memória em Pentecoste com fotos, mapas e objetos sobre a construção dos açudes, a piscicultura e as histórias das famílias da região. Bom ponto de partida para entender a região.",
        "duracao": "1 a 2 horas",
        "nota": 4.4,
        "numAvaliacoes": 58,
        "local": {"endereco": "Pentecoste/CE", "lat": -3.79, "lng": -39.27},
    },
    {
        "id": 26,
        "nome": "Memorial Ferroviário",
        "categorias": ["museus", "historicos"],
        "valorEstimado": 25,
        "descricao": "A antiga estação e a memória do trem que cortava o interior, em São Luís do Curu.",
        "detalhes": "Visita à antiga estação ferroviária e ao acervo sobre o ramal que ligava o interior ao litoral, com locomotivas, fotos e a história do transporte que moldou as cidades do vale.",
        "duracao": "1 a 2 horas",
        "nota": 4.4,
        "numAvaliacoes": 52,
        "local": {"endereco": "São Luís do Curu/CE", "lat": -3.6672, "lng": -39.2436},
    },
    {
        "id": 28,
        "nome": "Centro Cultural de Paraipaba",
        "categorias": ["museus", "historicos", "gastronomia"],
        "valorEstimado": 20,
        "descricao": "Artesanato, cajucultura e as tradições de Paraipaba e do distrito de Lagoinha.",
        "detalhes": "Visita ao centro cultural de Paraipaba com mostra de artesanato local, história da cajucultura e da praia de Lagoinha, além de agenda de forró e da tradicional Regata de Lagoinha (julho).",
        "duracao": "1 a 2 horas",
        "nota": 4.2,
        "numAvaliacoes": 38,
        "local": {"endereco": "Paraipaba/CE", "lat": -3.4386, "lng": -39.1467},
    },
]


def _galeria(passeio_id: int, categorias: list[str]) -> list[str]:
    capa = f"{_PASSEIO_DIR}/{passeio_id}.jpg"
    extras = [f"{_CATEGORIA_DIR}/{slug}.jpg" for slug in categorias]
    return [capa, *extras]


def build_passeios() -> list[Passeio]:
    passeios = []
    for d in PASSEIOS_SEED:
        imagem = f"{_PASSEIO_DIR}/{d['id']}.jpg"
        passeios.append(
            Passeio(
                id=d["id"],
                nome=d["nome"],
                categorias=d["categorias"],
                imagem=imagem,
                galeria=_galeria(d["id"], d["categorias"]),
                valor_estimado=float(d["valorEstimado"]),
                descricao=d["descricao"],
                detalhes=d["detalhes"],
                duracao=d["duracao"],
                nota=float(d["nota"]),
                num_avaliacoes=int(d["numAvaliacoes"]),
                local_endereco=d["local"]["endereco"],
                local_lat=float(d["local"]["lat"]),
                local_lng=float(d["local"]["lng"]),
            )
        )
    return passeios
