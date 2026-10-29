"""
Gera os 19 arquivos estáticos de áudio neural Kokoro TTS para o módulo de Instrumentais & Materiais
Saída: public/audio/tts/material_<id>.mp3
"""

import os
import re
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT_DIR = os.getcwd()
MODEL_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "kokoro-v1.0.onnx")
VOICES_PATH = os.path.join(ROOT_DIR, "kokoro_weights", "voices-v1.0.bin")
OUT_DIR = os.path.join(ROOT_DIR, "public", "audio", "tts")
os.makedirs(OUT_DIR, exist_ok=True)

so = ort.SessionOptions()
so.intra_op_num_threads = 4
sess = ort.InferenceSession(MODEL_PATH, sess_options=so, providers=["CPUExecutionProvider"])
kokoro = Kokoro.from_session(sess, VOICES_PATH)

materials = [
    {
        "id": "espelho_bucal",
        "text": "Espelho Bucal Plano. Instrumento primário fundamental constituído por cabo recartilhado metálico e cabeça circular espelhada plana de primeiro plano. Função principal: Visão indireta, iluminação por reflexão de luz direta, retração e proteção de tecidos moles como língua e bochechas. Modo de empunhadura e aplicação: Empunhadura de caneta modificada clássica, com apoio digital em dente vizinho ou rebordo para estabilidade e prevenção de traumatismos. Biossegurança e esterilização: Esterilização obrigatória em autoclave a cento e trinta e quatro graus por quinze minutos. Dica clínica: Para evitar o embaçamento pela respiração do paciente, encoste o espelho suavemente na mucosa jugal interna antes da inspeção."
    },
    {
        "id": "sonda_exploradora",
        "text": "Sonda Exploradora número cinco. Instrumento duplo afilado em aço inoxidável cirúrgico temperado de alta sensibilidade tátil com pontas ativas contra-anguladas. Função principal: Avaliação tátil da integridade das superfícies dentárias, margens de restaurações e continuidade do esmalte. Modo de empunhadura e aplicação: Empunhadura de caneta modificada com toque extremamente suave e leve. Jamais aplicar pressão excessiva em sulcos escurecidos para não causar cavitação iatrogênica em lesões de mancha branca. Biossegurança: Autoclavável a cento e trinta e quatro graus com pontas protegidas por tubos de silicone."
    },
    {
        "id": "pinca_clinica",
        "text": "Pinça Clínica Odontológica. Instrumento duplo articulado em aço inoxidável com pontas afiladas estriadas e anguladas a quarenta e cinco graus. Função principal: Apreensão, transporte e remoção de pequenos materiais, roletes de algodão, gaze, pontas de papel absorvente e corpos estranhos na cavidade oral. Modo de empunhadura: Empunhadura palmar digital com pinçamento controlado. Biossegurança: Autoclavável a cento e trinta e quatro graus."
    },
    {
        "id": "sonda_periodontal",
        "text": "Sonda Periodontal Milimetrada. Instrumento de diagnóstico com extremidade cilíndrica afilada calibrada com marcações em milímetros e ponta arredondada atraumática de meio milímetro. Função principal: Medição precisa da profundidade de sondagem do sulco gengival e bolsas periodontais, perda de inserção clínica e presença de sangramento à sondagem. Modo de empunhadura: Inserção paralela ao longo eixo da raiz com pressão padronizada constante de vinte a vinte e cinco gramas. Dica clínica: O sangramento à sondagem indica processo inflamatório ativo na base da bolsa e precede a perda óssea periodontal radiograficamente visível."
    },
    {
        "id": "colher_dentina",
        "text": "Escavador ou Colher de Dentina. Instrumento cortante manual duplo com extremidades ativas em formato de concha circular e bordas perimétricas afiadas. Função principal: Curetagem e remoção seletiva manual de dentina infectada necrótica amolecida durante o tratamento restaurador e proteção pulpar. Modo de empunhadura: Movimentos circulares contínuos de varredura das paredes circundantes para o centro da cavidade, apoiando firmemente em dentes vizinhos. Dica clínica: Ao aproximar-se do teto da polpa, a colher de dentina proporciona maior sensibilidade tátil que brocas rotatórias, diminuindo o risco de exposição pulpar acidental."
    },
    {
        "id": "alta_rotacao",
        "text": "Caneta de Alta Rotação ou Turbina. Instrumento rotatório pneumático operado por ar comprimido com rotação ultra-rápida entre trezentos mil e quatrocentos e cinquenta mil rotações por minuto, com sistema push-button e spray triplo de refrigeração. Função principal: Corte rápido e preciso de esmalte dental hígido, desgaste de materiais restauradores antigos e preparos protéticos. Modo de empunhadura: Toques intermitentes leves em pincelamento. A refrigeração abundante com spray de água é mandatória para evitar necrose pulpar por calor friccional."
    },
    {
        "id": "contra_angulo",
        "text": "Contra-Ângulo de Baixa Rotação. Instrumento acoplado ao micromotor pneumático ou elétrico com redução mecânica ou transmissão um para um, operando entre cinco mil e quarenta mil rotações por minuto com elevado torque. Função principal: Remoção seletiva de dentina cariada profunda, acabamento e polimento de restaurações e profilaxia. Dica clínica: O alto torque do contra-ângulo corta com eficiência mesmo em rotações mínimas, permitindo excelente remoção tátil de dentina sem gerar calor excessivo."
    },
    {
        "id": "brocas_odontologicas",
        "text": "Brocas Diamantadas e Esféricas. Pontas ativas rotatórias acopláveis em haste metálica padronizada. As diamantadas possuem microgrânulos de diamante sinterizados para corte de esmalte e preparos cavitários; as esféricas de aço carbide possuem lâminas helicoidais usinadas para remoção seletiva de dentina cariada necrótica. Dica clínica: As brocas diamantadas são identificadas por faixas coloridas na haste: anel azul granulação média, anel vermelho fina e anel amarelo ultra-fina para polimento."
    },
    {
        "id": "fotopolimerizador",
        "text": "Fotopolimerizador LED Odontológico. Dispositivo eletrônico emissor de luz azul potente em comprimento de onda calibrado de quatrocentos e cinquenta a quatrocentos e oitenta nanômetros com irradiância entre mil e dois mil miliwatts por centímetro quadrado. Função principal: Ativação da reação química de polimerização em resinas compostas, sistemas adesivos e cimentos resinosos. Dica clínica: Mantenha a ponteira a um milímetro da resina; o afastamento excessivo reduz drasticamente a energia recebida, causando subpolimerização."
    },
    {
        "id": "espatula_resina",
        "text": "Espátula de Inserção de Resina em Titânio. Instrumental especializado em aço cirúrgico com revestimento superficial em nitreto de titânio dourado acetinado de alta dureza e propriedade antiaderente. Função principal: Inserção, condensação e escultura anatômica precisa de cúspides, vertentes e cristas marginais em restaurações estéticas. Dica clínica: Para que a resina não puxe no momento da desinserção da espátula, mantenha a ponta ativa limpa com uma gaze com álcool setenta por cento seco."
    },
    {
        "id": "resina_composta",
        "text": "Seringa de Resina Composta Restauradora. Material restaurador estético direto acondicionado em seringa fotoprotetora preta com êmbolo de rosca dosador. Composta por matriz orgânica, partículas de carga inorgânica de sílica e zircônia e fotoiniciadores. Função principal: Restauração morfofuncional e estética de dentes com cárie, fraturas coronárias e fechamento de diastemas. Dica clínica: Aplique em técnica incremental de no máximo dois milímetros por camada para mitigar o estresse de contração de polimerização."
    },
    {
        "id": "acido_fosforico",
        "text": "Seringa de Ácido Fosfórico a trinta e sete por cento. Gel tixotrópico de ácido ortofosfórico na concentração padrão de trinta e sete por cento com coloração azul cobalto para nítida visualização. Função principal: Condicionamento ácido total do esmalte e dentina, criando microporosidades micromecânicas e desmineralização controlada. Dica clínica: A dentina nunca deve ser desidratada agressivamente com ar contínuo após o enxágue; ela deve ficar ligeiramente úmida para evitar o colapso da rede de colágeno."
    },
    {
        "id": "sistema_adesivo",
        "text": "Frasco de Sistema Adesivo Odontológico. Frasco dosador âmbar com resina fluida monomérica com solventes voláteis e monômeros funcionais como dez MDP para união química à hidroxiapatita. Função principal: Formação da camada híbrida através da interpenetração de monômeros resinosos nas microporosidades do esmalte e na rede de colágeno da dentina desmineralizada. Dica clínica: A evaporação completa do solvente com ar suave antes de fotopolimerizar é essencial para prevenir sensibilidade pós-operatória."
    },
    {
        "id": "espatula_24_placa",
        "text": "Espátula número vinte e quatro e Placa de Vidro. Conjunto formado por espátula metálica flexível de lâmina longa plana dupla e placa de vidro maciça espessa de bordas biseladas lapidadas. Função principal: Manipulação por aglutinação e espatulação ampla de cimentos odontológicos como cimento de ionômero de vidro e cimento de fosfato de zinco. Dica clínica: No fosfato de zinco, a espatulação em oito na placa fria controla a reação exotérmica e permite maior incorporação de pó com maior resistência mecânica."
    },
    {
        "id": "lencol_borracha",
        "text": "Lençol de Borracha ou Dique. Folha quadrada de látex de borracha natural ou elastômero livre de látex de quinze por quinze centímetros. Função principal: Barreira física total de isolamento do campo operatório, bloqueando saliva, sangue, umidade do ar expirado e vapor bucal. Essencial em endodontia para assepsia total e proteção contra aspiração de limas, e em dentística para máxima adesão aos tecidos dentários."
    },
    {
        "id": "arco_young",
        "text": "Arco de Young para Isolamento. Armação em formato de U em aço inoxidável ou polímero radiotransparente flexível contendo pequenos pinos tensores perimétricos. Função principal: Estiramento, fixação e manutenção da tensão do lençol de borracha fora da boca do paciente, mantendo o campo operatório aberto e desobstruído. Posicionado com a concavidade voltada para a face do paciente, orientando a parte aberta do U para cima."
    },
    {
        "id": "grampos_isolamento",
        "text": "Grampos de Isolamento Absoluto. Dispositivos de fixação elástica confeccionados em aço mola temperado inoxidável, formados por arco elástico central, duas asas laterais perfuradas e bicos internos com orifícios de apreensão para a pinça. Função principal: Retenção mecânica subgengival do lençol de borracha na constrição cervical do dente de ancoragem. Dica clínica: Amarrilho prévio com fio dental no arco do grampo é mandatório por norma de segurança clínica para evitar aspiração acidental."
    },
    {
        "id": "pinca_palmer",
        "text": "Pinça Porta-Grampos de Palmer. Alicate cirúrgico articulado com mola expansora interna, trava deslizante e pontas frontais arredondadas em bico de papagaio projetadas para acoplar nos orifícios laterais dos grampos. Função principal: Abertura elástica controlada, transporte seguro, inserção e remoção dos grampos de isolamento sobre a coroa dental sem ferir tecidos moles."
    },
    {
        "id": "perfurador_ainsworth",
        "text": "Perfurador de Lençol de Ainsworth. Alicate mecânico de alta precisão composto por haste com pino perfurante cônico de aço temperado e base inferior dotada de disco circular giratório com cinco orifícios de diâmetros decrescentes. Função principal: Perfuração de orifícios circulares perfeitamente nítidos no lençol de borracha, compatíveis com a anatomia cervical de molares, pré-molares, caninos e incisivos."
    }
]

silence = np.zeros(int(24000 * 0.16), dtype=np.float32)

for item in materials:
    mat_id = item["id"]
    text = item["text"]
    out_path = os.path.join(OUT_DIR, f"material_{mat_id}.mp3")
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"Áudio já existe: {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")
        continue

    print(f"Gerando áudio para {mat_id}...")
    raw_parts = [s.strip() for s in re.split(r"(?<=[.?!;:])\s+", text) if s.strip()]
    audio_segments = []

    for part in raw_parts:
        samples, sr = kokoro.create(part, voice="pf_dora", speed=1.0, lang="pt-br")
        audio_segments.append(samples)
        audio_segments.append(silence)

    combined = np.concatenate(audio_segments) if audio_segments else np.zeros(24000, dtype=np.float32)
    sf.write(out_path, combined, 24000, format="MP3")
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Salvo: {out_path} ({size_kb:.1f} KB)")

print("Concluído todos os áudios de materiais!")

