DA.param.portal = {
	launcherGuide: false
};

DA.portal ={
	
	launcherClick: function(func,sub,param ){
		
	},
	
	listReload: function() {
		this.jsonConExecute('reload',{sub:'reload'}, true);
	},
	
	jsonConExecute: function(sub, args, nocache, key, hash) {
                if (nocache) {
                        jsonCon.executeCache($.extend({ func: 'portal', sub: sub }, args), key, hash);
                }
                jsonCon.execute($.extend({ func: 'portal', sub: sub }, args), key, true, hash);
        }
	
}

$(document).ready(function() {
	DA.customEvent.set("parallelContents.onSuccess",function(obj,params){
		//console.log(params.func);
		//console.log(params.sub);
	 });
});
//DA_portal_mail_exists_Id"
