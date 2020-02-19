import {getRequest} from "./RequestUtil";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data.data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
        }
    })
};

// 格式话后端传过来的router数据
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            keepAlive,
            requireAuth,
            icon,
            children
        } = router;
        // 递归调用 children
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            icon: icon,
            keepAlive: keepAlive,
            requireAuth: requireAuth,
            children: children,
            // 格式化component,动态加载
            component(resolve) {
                // 分别处理views目录下的不同component组件
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Access")) {
                    require(['../views/access/' + component + '.vue'], resolve);
                }
            }
        };
        fmRoutes.push(fmRouter);
    });
    return fmRoutes;
};






