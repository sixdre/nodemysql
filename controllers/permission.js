import {MenuModel} from '../models/'

//根据菜单主键id获取下级菜单
//id：菜单主键id
//arry：菜单数组信息
function GetParentArry(id, arry) {
    var newArry = new Array();
    for (var i in arry) {
        if (arry[i].pid == id)
            newArry.push(arry[i]);
    }
    return newArry;
}


function GetData(id, arry) {
    var childArry = GetParentArry(id, arry);		//一级菜单
    if (childArry.length > 0) {
        for (var i in childArry) {
        	var c = GetData(childArry[i].id, arry);
        	if(c.length){
        		childArry[i].child = c;
        	}
        }
    }
     
    return childArry;
}






class PermissionController {
	//查询所有
	async getMenus(req,res,next){
		try{
			let menus = await MenuModel.findAll();
   			var data = GetData(0, JSON.parse(JSON.stringify(menus)))
   			
			res.json({
				data,
				menus
			})


		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
		
	async createPermission(req,res,next){
		let {roleName,menusId} = req.body;
		
		
		
		res.json({
			roleName,
			menusId
		})
		
	}
	
}



export default new PermissionController();
