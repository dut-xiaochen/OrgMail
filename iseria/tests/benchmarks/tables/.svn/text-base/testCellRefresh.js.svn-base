function inner_normal( tdd, cs, rs )
{
	tdd.innerHTML = cell_data_b[ cs ][ rs ];
}

function inner_class( tdd, cs, rs )
{
	tdd.innerHTML = "<div class='lipton'>" + cell_data_b[ cs ][ rs ] + "</div>";
}

function inner_style( tdd, cs, rs )
{
//	tdd.innerHTML = "<div style='color:red;'>" + cell_data_b[ cs ][ rs ] + "</div>";

	tdd.innerHTML = "<div style='color:red;font-family:MS Pゴシック, monospace; font-size:9pt; padding:2px 2px 2px 2px;'>" + cell_data_b[ cs ][ rs ] + "</div>";
}

function inner_both( tdd, cs, rs )
{
	tdd.innerHTML = "<div class='lipton' style='color:red;font-family:MS Pゴシック, monospace; font-size:9pt; padding:2px 2px 2px 2px;'>" + cell_data_b[ cs ][ rs ] + "</div>";
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function div_inner_normal( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.innerHTML = cell_data_b[ cs ][ rs ];
	tdd.appendChild( div );
}

function div_inner_class( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.className = "lipton";
	div.innerHTML = cell_data_b[ cs ][ rs ];
	tdd.appendChild( div );
}

function div_inner_style( tdd, cs, rs  )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");

	div.style.color = "red";
	div.style.fontFamily = "MS Pゴシック, monospace";
	div.style.fontSize = "9pt";
	div.style.padding = "2px";

	div.innerHTML = cell_data_b[ cs ][ rs ];
	tdd.appendChild( div );
}

function div_inner_both( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.className = "lipton";

	div.style.color = "red";
	div.style.fontFamily = "MS Pゴシック, monospace";
	div.style.fontSize = "9pt";
	div.style.padding = "2px";

	div.innerHTML = cell_data_b[ cs ][ rs ];
	tdd.appendChild( div );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function div_text_normal( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.appendChild( document.createTextNode( cell_data_b[ cs ][ rs ] ) );
	tdd.appendChild( div );
}

function div_text_class( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.className = "lipton";
	div.appendChild( document.createTextNode( cell_data_b[ cs ][ rs ] ) );
	tdd.appendChild( div );

}

function div_text_style( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");

	div.style.color = "red";
	div.style.fontFamily = "MS Pゴシック, monospace";
	div.style.fontSize = "9pt";
	div.style.padding = "2px";

	div.appendChild( document.createTextNode( cell_data_b[ cs ][ rs ] ) );
	tdd.appendChild( div );
}

function div_text_both( tdd, cs, rs )
{
	tdd.innerHTML = "";
	var div = document.createElement("div");
	div.className = "lipton";

	div.style.color = "red";
	div.style.fontFamily = "MS Pゴシック, monospace";
	div.style.fontSize = "9pt";
	div.style.padding = "2px";

	div.appendChild( document.createTextNode( cell_data_b[ cs ][ rs ] ) );
	tdd.appendChild( div );
}


function forEachTd ( tbl, Func, log_str )
{

  var startTime = new Date()

    var trow = tbl.rows;
    for ( var rr = 0 ; rr < set_rows ; rr++ ){
	var tcells = trow[ rr ].cells;

	for ( var cc = 0 ; cc < set_cols ; cc++ ){
	    var td = tcells[ cc ];
	    Func( td, cc, rr  );
	}
    }

    var doneTime = new Date();
    logger.log( "change " + log_str + " : "  + time_diff( startTime, doneTime ) + "ms " );
    
}


function refresh_cell_nest( mode )
{

	//  get the target id BY FORM ( ID = ( target_static OR target_dynamic ) )
	//  mode = ( 1 : innerHTML ,  2 : div->innerHTML,  3 : div->textNode )

	var id;
	var mode_str;
	var option = 0;
	var option_str = "";
	var startTime;


	//  set the Target Table
	//  checkbox( target_static ) or checkbox ( target_dynamic )
	/////////////////////////////////////////////////////////////////
	if ( document.getElementById("target_static").checked  == true){		id = "static";	}
	else if ( document.getElementById("target_dynamic").checked  == true){	id = "dynamic";	}
	else{		alert( 'Set the target' );		return ( false ); 	}

	table = document.getElementById ( id );

	//  option = 0 : NO option
	//  option = 1 : only CLASS tag
	//  option = 2 : only STYLE tag
	//  option = 3 : BOTH tag ( CLASS , STYLE )
	//////////////////////////////////////////////////////////

	if( document.getElementById("check_lipton").checked == true  ){
		option += 1;
		option_str += " with CLASS ";
	}

	if ( document.getElementById("check_4a4").checked == true ){
		option += 2
		option_str += " with STYLE ";
	}

	//////////////////////////////////////////////////////



	if ( mode == 1 ){                            ////  For STATIC Table
		mode_str = " innerHTML ";

		if ( option == 0 ){    /// normal
			forEachTd( table, inner_normal, ( mode_str + option_str + " on " + id ));
		}else if ( option == 1 ){   /// only CLASS
			forEachTd( table, inner_class, ( mode_str + option_str + " on " + id ));
		}else if ( option == 2 ){   /// only STYLE
			forEachTd( table, inner_style, ( mode_str + option_str + " on " + id ));
		}else if ( option == 3 ){   /// both ( CLASS, STYLE )
			forEachTd( table, inner_both, ( mode_str + option_str + " on " + id ));
		}else {
			alert ( "option is invalid ");
			return false;
		}

	}else if ( mode == 2 ){                     ////  For Dynamic Table
		mode_str = " div.innerHTML ";

		if ( option == 0 ){    /// normal
			forEachTd( table, div_inner_normal, ( mode_str + option_str + " on " + id ));
		}else if ( option == 1 ){   /// only CLASS
			forEachTd( table, div_inner_class, ( mode_str + option_str + " on " + id ));
		}else if ( option == 2 ){   ///  STYLE
			forEachTd( table, div_inner_style, ( mode_str + option_str + " on " + id ));
		}else if ( option == 3 ){   /// both ( CLASS, STYLE )
			forEachTd( table, div_inner_both, ( mode_str + option_str + " on " + id ));
		}else {
			alert ( "option is invalid ");
			return false;
		}

	}else if ( mode == 3 ){
		mode_str = " div.TextNode ";

		if ( option == 0 ){    /// normal
			forEachTd( table, div_text_normal, ( mode_str + option_str + " on " + id ));
		}else if ( option == 1 ){   /// only CLASS
			forEachTd( table, div_text_class, ( mode_str + option_str + " on " + id ));
		}else if ( option == 2 ){   ///  STYLE
			forEachTd( table, div_text_style, ( mode_str + option_str + " on " + id ));
		}else if ( option == 3 ){   /// both ( CLASS, STYLE )
			forEachTd( table, div_text_both, ( mode_str + option_str + " on " + id ));
		}else {
			alert ( "option is invalid ");
			return false;
		}

	}else {
		alert ( "mode is invalid ");
		return false;
	}




}

function change_innerHTML( id )
{

  var startTime = new Date()
	for ( var rr = 0 ; rr < set_rows ; rr++ ){
		for ( var cc = 0 ; cc < set_cols ; cc++ ){
			table.rows[ rr ] .cells[ cc ].innerHTML  =  cell_data_b[ cc ][ rr ];
		}
	}
	var doneTime = new Date();
	logger.log( "change innerHTML on " + id + " : "  + time_diff( startTime, doneTime ) + "ms " );
}


function refresh_cell_row()
{

    var id;
    var table;
    var option = 0 ;
    var option_str = "";

    //  set the Target Table
    //  checkbox( target_static ) or checkbox ( target_dynamic )
    /////////////////////////////////////////////////////////////////
    if ( document.getElementById("target_static").checked  == true){		id = "static";	}
    else if ( document.getElementById("target_dynamic").checked  == true){	id = "dynamic";	}
    else{		alert( 'Set the target' );		return ( false ); 	}

    table = document.getElementById ( id );

    //  option = 0 : NO option
    //  option = 1 : only CLASS tag
    //  option = 2 : only STYLE tag
    //  option = 3 : BOTH tag ( CLASS , STYLE )
    //////////////////////////////////////////////////////////


    if( document.getElementById("check_lipton").checked == true  ){
	option += 1;
	option_str += " with CLASS ";
    }
    
    if ( document.getElementById("check_4a4").checked == true ){
	option += 2
	option_str += " with STYLE ";
    }

    //////////////////////////////////////////////////////


    log_str = " on " + id + "  " + option_str;
    var startTime = new Date()

    var trow = table.rows;
    if ( option == 0 ){
	for ( var ra = 0 ; ra < set_rows ; ra++ ){
//	    table.rows[ ra ].innerHTML = "hoge";
	    trow[ ra ].innerHTML = row_data[ ra ];
	}
    }else if ( option == 1 ){
	for ( var ra = 0 ; ra < set_rows ; ra++ ){
	    trow[ ra ].innerHTML = row_data_class[ ra ];
	}
    }else if ( option == 2 ){
	for ( var ra = 0 ; ra < set_rows ; ra++ ){
	    trow[ ra ].innerHTML = row_data_style[ ra ];
	}
    }else {
	alert ( "class  + style is not supported ..... :-/ " );
    }


    var doneTime = new Date();
    logger.log( "Row Change :  " + log_str + " : "  + time_diff( startTime, doneTime ) + "ms " );
}

