

var annuaire = [];



// Générer le tableau HTML

function generer() {
	$('table tbody').html('');

	console.log( annuaire );

	for( var i=0 ; i<annuaire.length ; i++ ) {
		var quelquun = annuaire[i];

		var ligne = $('<tr/>').data("ID",i);

		$('<td/>').html(i).appendTo(ligne);
		$('<td/>').append( $('<input class="prenom"/>').val(quelquun.prenom) ).appendTo(ligne);
		$('<td/>').append( $('<input class="nom"/>').val(quelquun.nom) ).appendTo(ligne);
		$('<td/>').append( $('<input class="age"/>').val(quelquun.age) ).appendTo(ligne);
		$('<td/>').html('<button class="del">X</button><button class="upd">+</button>').appendTo(ligne);

		$('table tbody').append( ligne );

		$("table").trigger("update"); // MAJ tablesorter (pour prendre en compte les nouvelles lignes)
	}
}



// Sauvegarder l'annuaire dans localStorage

function sauvegarder(){
	localStorage.setItem('annuaire', JSON.stringify(annuaire) );
}



// Charger l'annuaire dans le HTML depuis localStorage

function charger(){
	var a = localStorage.getItem('annuaire');

	if( a != null ) {
		annuaire = JSON.parse( a );
	}
	console.log( annuaire );
}





$(document).ready(function(){



	// Charger les données précédemment sauvegardées

	charger();
	generer();




	// Ajouter une personne à l'annuaire

	$('#add').on('click', function(){
		
		var personne = {
			"prenom":	$('#ajout input[name="prenom"]').val(),
			"nom": 		$('#ajout input[name="nom"]').val(),
			"age": 		$('#ajout input[name="age"]').val()
		};

		annuaire.push( personne );

		sauvegarder();
		generer();

		console.log( annuaire );
		$('#ajout input').val('');
		$('a[href="#voir"]').trigger('click');
	});





	// Supprimer une personne de l'annuaire et du tableau HTML

	$('table').delegate('button.del', 'click', function(){

		var ligne = $(this).parent().parent();
		var ID = ligne.data('ID');

		ligne.remove();
		annuaire.splice(ID, 1);
		console.log( annuaire );

		sauvegarder();
		generer();
	});




	// Mettre à jour une personne dand l'annuaire et dans le tableau HTML

	$('table').delegate('button.upd', 'click', function(){

		var ligne = $(this).parent().parent();
		var ID = ligne.data('ID');

		annuaire[ID] = {
			prenom: ligne.find('.prenom').val(),
			nom: 	ligne.find('.nom').val(),
			age: 	ligne.find('.age').val()
		}

		console.log( annuaire );

		sauvegarder();
		generer();
	});




	// Tableau triable

	$("table").tablesorter({textExtraction: function(node) {
		var val = $(node).find('input').val();
		return val ? val : $(node).text();
	}});




	// Moteur de recherche

	$('thead input').on('keyup', function(){
		$('tbody tr').show();

		// Pour chaque critere...

		$('thead input').each(function(i,e){
			var critere = $(e).val();
			var ligne = i;

			// ...on teste toutes les lignes !

			$('tbody tr').each(function(i,e){	
				var valeur = $(this).find('input').val();
				var colonne = i;


				if( ! valeur.includes(critere) && critere != '' ) {
					console.log(ligne +'/'+ colonne +'/' + valeur +'/'+ critere );
					$($('tbody tr').get(colonne)).hide(0);
				}
				else
				{
				//	$($('tbody tr').get(colonne)).show(500);
				}

			});
		});
	});





	// Bouton RESET du formulaire de recherche

	$('button.reset').on('click', function(){
		$('thead input').val('').first().trigger('keyup');
	});
});



