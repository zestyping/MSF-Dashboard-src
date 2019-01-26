/*------------------------------------------------------------------------------------
    MSF Dashboard - main-loadfiles.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file is the current implementation of the dataloader module. It actually combines multiple functions: requesting data from sources, reading and formatting data connecting with module-lang.js and module-datacheck.js and the main-core.js.
 * @since 0.0
 * @module main_loadfiles
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires lang/module-lang.js
 * @requires js/module-datacheck.js
 * @requires module:main-core.js
 * @todo This implementation should be revised in the next versions.
 **/

/*------------------------------------------------------------------------------------
	Components:
	6) Generate display
------------------------------------------------------------------------------------*/

// 6) Generate Display
//------------------------------------------------------------------------------------
/**
 * Generates the general display to select {@link module:g.medical_files} in {@link module:g.medical_filelist} (and launches {@link module:main_loadfiles~queue_medical} when a new file is selected from the list). And give the option to load the dashboard with the function {@link module:main-core~generateDashboard}.<br>
 Also loads {@link module:module_datacheck} and {@link module:module-lang} and embeds some related displays (quick datacheck summary {@link module:module_datacheck~display}, errors log {@link module:module_datacheck~showlog} and related interactions {@link module:module_datacheck~interaction} for the datacheck module and language switch buttons {@link module:module_lang~display} for the lang module).
 * @function
 * @requires queue_medical
 * @requires module:module_datacheck
 * @requires module:lang
 * @requires module:main_core
 * @alias module:main_loadfiles~generate_display
 **/
function generate_display() {
	var html = '';
    var loc = g.module_lang.text[g.module_lang.current];
    html += '<div class="file-select">';
	if (g.medical_filelist) {
		html += '<h3>' + loc.loadfiles_choose + '</h3>';
        html += '<p>Select one or more files.';
        html += '<p><select multiple class="select-lf" id="selectform" size=8>';
		g.medical_filelist.forEach(function(f) {
            sel = g.medical_files.indexOf(f) >= 0 ? ' selected': '';
			html +='<option value="' + f + '"' + sel + '>' + f + '</option>';
		});
	}
	html += '</select> <span id="langselect"></span></p>';
    html += '</div>';

    html += '<div class="file-details">';
    html += '<div id="datacheck-working" class="invisible">';
    html += 'Inspecting the selected data...';
    html += '</div>';
    html += '<div id="datacheck-results">';
	html += module_datacheck.display();
	html += '</div>';
	html += '</div>';

	html += '<div class="row"><div class="col-md-12"><p><br><button class="select-lf" id="loaddashboard">' + loc.loadfiles_load + '</button></p></div></div>';

	$('.modal-content').html(html);

	$("#selectform").change(function(){
        $('#datacheck-working').removeClass('invisible');
        $('#datacheck-results').addClass('invisible');
        // Use setTimeout to give the DOM a chance to render the change.
        setTimeout(function() {
    		g.medical_files = $('#selectform').val();
    		module_getdata.reload_medical();
        }, 100);
	});


	// Load Here Optional Modules Interaction:
	//------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------

	// Load Optional Modules: module-datacheck.js | module-lang.js
	//------------------------------------------------------------------------------------
	//module_colorscale_interaction();
	module_lang.display();
	module_datacheck.showlog();
	module_datacheck.interaction();

	$('#loaddashboard').on('click',function(){
		$('#modal').modal('hide');
		if (typeof main_loadfiles_readvar === "function") { 
			main_loadfiles_readvar();			//re-loads variables that require g.module_lang.current - in case user changes language from default
		};
		if (typeof main_loadfiles_readcharts === "function") { 
		    main_loadfiles_readcharts();		//re-loads variables that may require g.module_lang.current - in case user changes language from default
		};
		generateDashboard();
	});

	if (g.module_datacheck.autoload) {
		$('#loaddashboard').click();
	}

	//------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------

}

function plural(n, plural, singular) {
    plural = plural || 's';
    singular = singular || '';
    return n === 1 ? singular : plural;
}
