// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/clientes',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(cpf, nome, ddd, tel, placa, tipoVeiculo, carroceria) {
            let ajax_options = {
                type: 'POST',
                url: 'api/clientes',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'cpf': cpf,
					'nome': nome,
					'ddd': ddd,
					'tel': tel,
					'placa': placa,
					'tipoVeiculo': tipoVeiculo,
                    'carroceria': carroceria
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(cpf, nome, ddd, tel, placa, tipoVeiculo, carroceria) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/clientes/' + cpf,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
					'cpf': cpf,
					'nome': nome,
					'ddd': ddd,
					'tel': tel,
					'placa': placa,
					'tipoVeiculo': tipoVeiculo,
                    'carroceria': carroceria
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(cpf) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/clientes/' + cpf,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $cpf = $('#cpf'),
		$nome = $('#nome'),
		$ddd = $('#ddd'),
		$tel = $('#tel'),
		$placa = $('#placa'),
		$tipoVeiculo = $('#tipoVeiculo'),
        $carroceria = $('#carroceria');

    // return the API
    return {
        reset: function() {
            $cpf.val('').focus();
            $nome.val('');
			$ddd.val('');
			$tel.val('');
			$placa.val('');
			$tipoVeiculo.val('');
			$carroceria.val('');
        },
        update_editor: function(cpf, nome, placa) {
            $cpf.val(cpf).focus();
            $nome.val(nome);
			$placa.val(placa);
        },
        build_table: function(people) {
            let rows = ''

            // clear the table
            $('.conteudo table > tbody').empty();

            // did we get a people array?
            if (people) {
                for (let i=0, l=people.length; i < l; i++) {
                    rows += `<tr><td class="cpf">${people[i].cpf}</td><td class="nome">${people[i].nome}</td><td class="placa">${people[i].placa}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $cpf = $('#cpf'),
		$nome = $('#nome'),
		$ddd = $('#ddd'),
		$tel = $('#tel'),
		$placa = $('#placa'),
		$tipoVeiculo = $('#tipoVeiculo'),
        $carroceria = $('#carroceria');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(cpf, nome, placa) {
        return cpf !== "" && nome !== "" && placa !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let cpf = $cpf.val(),
			nome = $nome.val(),
			ddd = $ddd.val(),
			tel = $tel.val(),
			placa = $placa.val(),
			tipoVeiculo = $tipoVeiculo.val(),
            carroceria = $carroceria.val();

        e.preventDefault();

        if (validate(cpf, nome, placa)) {
            model.create(cpf, nome, ddd, tel, placa, tipoVeiculo, carroceria)
        } else {
            alert('Problema com os parâmetros: CPF ou Nome ou Placa');
        }
    });

    $('#update').click(function(e) {
        let cpf = $cpf.val(),
			nome = $nome.val(),
			ddd = $ddd.val(),
			tel = $tel.val(),
			placa = $placa.val(),
			tipoVeiculo = $tipoVeiculo.val(),
            carroceria = $carroceria.val();

        e.preventDefault();

        if (validate(cpf, nome, placa)) {
            model.update(cpf, nome, ddd, tel, placa, tipoVeiculo, carroceria)
        } else {
            alert('Problema com os parâmetros: CPF ou Nome ou Placa');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let cpf = $cpf.val();

        e.preventDefault();

        if (validate('placeholder', cpf)) {
            model.delete(cpf)
        } else {
            alert('Problema com os parâmetros: CPF ou Nome ou Placa');
        }
        e.preventDefault();
    });
    

    $('#reset').click(function() {
        //location.reload();
        //model.read();
        window.location.reload();
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            cpf,
            nome,
			ddd,
			tel,
			placa,
			tipoVeiculo,
			carroceria;

        cpf = $target
            .parent()
            .find('td.cpf')
            .text();

        nome = $target
            .parent()
            .find('td.nome')
            .text();

		placa = $target
            .parent()
            .find('td.placa')
            .text();

        view.update_editor(cpf, nome, placa);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = "Msg de Erro:" + textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));