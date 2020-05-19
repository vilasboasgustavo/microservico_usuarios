from datetime import datetime
from flask import jsonify, make_response, abort

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

PEOPLE = {
    "12345678900": {
        "cpf": "12345678900",
        "nome": "Emerson Jones",
		"ddd": "011",
		"tel": "991910001",
		"placa": "DJE1010",
		"tipoVeiculo": "Rodotrem",
		"carroceria": "Cacamba",
    },
    "99945678900": {
        "cpf": "99945678900",
        "nome": "Jack Sparrow",
		"ddd": "011",
		"tel": "998880801",
		"placa": "COV1A010",
		"tipoVeiculo": "Carreta",
		"carroceria": "Granaleiro",
    },
    "32145678800": {
        "cpf": "32145678800",
        "nome": "Paulo Snow",
		"ddd": "021",
		"tel": "977990801",
		"placa": "AAA1111",
		"tipoVeiculo": "Bitrem",
		"carroceria": "Granaleiro",
    },
}

def read_all():
    dict_clientes = [PEOPLE[key] for key in sorted(PEOPLE.keys())]
    clientes = jsonify(dict_clientes)
    qtd = len(dict_clientes)
    content_range = "clientes 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    clientes.headers['Access-Control-Allow-Origin'] = '*'
    clientes.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    clientes.headers['Content-Range'] = content_range
    return clientes

def read_one(cpf):
    if cpf in PEOPLE:
        person = PEOPLE.get(cpf)
    else:
        abort(
            404, "Pessoa com CPF {cpf} nao encontrado".format(cpf=cpf)
        )
    return person


def create(person):
    cpf = person.get("cpf", None)
    nome = person.get("nome", None)
    ddd = person.get("ddd", None)
    tel = person.get("tel", None)
    placa = person.get("placa", None)
    tipoVeiculo = person.get("tipoVeiculo", None)
    carroceria = person.get("carroceria", None)

    if cpf not in PEOPLE and cpf is not None:
        PEOPLE[cpf] = {
            "cpf": cpf,
            "nome": nome,
			"ddd": ddd,
			"tel": tel,
			"placa": placa,
			"tipoVeiculo": tipoVeiculo,
			"carroceria": carroceria,
        }
        return make_response(
            "Usuário {cpf} criado com sucesso".format(cpf=cpf), 201
        )
    else:
        abort(
            406,
            "Usuário com CPF {cpf} ja existe".format(cpf=cpf),
        )


def update(cpf, person):
    if cpf in PEOPLE:
        PEOPLE[cpf]["nome"] = person.get("nome")
        PEOPLE[cpf]["ddd"] = person.get("ddd")
        PEOPLE[cpf]["tel"] = person.get("tel")
        PEOPLE[cpf]["placa"] = person.get("placa")
        PEOPLE[cpf]["tipoVeiculo"] = person.get("tipoVeiculo")
        PEOPLE[cpf]["carroceria"] = person.get("carroceria")

        return PEOPLE[cpf]
    else:
        abort(
            404, "Usuário com CPF {cpf} nao encontrado".format(cpf=cpf)
        )

def delete(cpf):
    if cpf in PEOPLE:
        del PEOPLE[cpf]
        return make_response(
            "Usuário {cpf} deletado com sucesso".format(cpf=cpf), 200
        )
    else:
        abort(
            404, "Usuário com CPF {cpf} nao encontrada".format(cpf=cpf)
        )