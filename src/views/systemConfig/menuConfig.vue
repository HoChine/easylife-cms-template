<template>
    <div class="menuConfig">
        <el-button type="primary" @click="appendTopMenu('group')">新建顶级菜单组</el-button>
        <el-button type="primary" @click="appendTopMenu('single')">新建顶级菜单</el-button>
        <div class="custom-tree-node tree-title mb20 mt20">
            <span class="ml30">菜单名称</span>
            <span>
                <span class="mr150 w100 path inline-block">路由路径</span>
                <span class="handle inline-block">操作</span>
            </span>
        </div>
        <el-tree
                :data="menuData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :props="menuProps"
                draggable
                :allow-drop="allowDrop">
            <span class="custom-tree-node" slot-scope="{data, node}">
                <span>
                    <span>{{ data.name }}</span>
                </span>
                <span>
                    <span class="mr150 w100 inline-block">{{ data.path ? '/' + data.path : '' }} {{data.level}}</span>
                    <el-button
                            type="text"
                            size="mini"
                            v-if="data.menuType === 2"
                            @click="() => handleMenuData('append', data, 'group')">
                      添加子菜单组
                    </el-button>
                    <el-button
                            type="text"
                            size="mini"
                            v-if="data.menuType === 2"
                            @click="() => handleMenuData('append', data,'single')">
                      添加子菜单
                    </el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="() => handleMenuData('editor', data, data.menuType === 1? 'single':'group')">
                      编辑菜单
                    </el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="() => removeMenuData(data, node)">删除菜单
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog :title="(currentMenuHandleStatus !== 'editor' ? '新建': '编辑') + (currentMenuHandleType === 'single' ?'菜单':'菜单组')" width="500px" :visible.sync="dialogMenuFromVisible">
            <el-form :model="menuFrom" ref="menuFrom">
                <el-form-item label="菜单名称" label-width="80">
                    <el-input class="w380" v-model="menuFrom.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" label-width="80" v-if="currentMenuHandleType === 'single'">
                    <el-input class="w380" v-model="menuFrom.path" autocomplete="off">
                        <template slot="prepend">/</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMenuFromVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuFrom">确 定</el-button>
            </div>
        </el-dialog>
        {{menuData}}
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'menuConfig',
        data() {
            return {
                menuProps: {
                    label: 'name',
                    children: 'children'
                },
                menuFrom: {
                    name: "",
                    path: ""
                },
                currentMenuData: {},
                currentMenuHandleStatus: 'append',
                currentMenuHandleType: 'single',
                dialogMenuFromVisible: false,
                menuData: [],
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            appendTopMenu(type) {
                this.currentMenuHandleStatus = 'appendTop';
                this.currentMenuHandleType = type;
                this.dialogMenuFromVisible = true;
                this.menuFrom = {name: "", path: ""};
            },
            saveMenuFrom() {
                if (!this.menuFrom.name) {
                    this.$message.warning('请输入菜单名称');
                    return false;
                }
                if (!this.menuFrom.path && this.currentMenuHandleType === 'single') {
                    this.$message.warning('请输入菜单路径');
                    return false;
                }
                // 添加顶级菜单
                if (this.currentMenuHandleStatus === 'appendTop') {
                    let menu = this.currentMenuHandleType === 'single'
                        ? {
                            id: +new Date(),
                            name: this.menuFrom.name,
                            path: this.menuFrom.path,
                            menuType: 1,
                            level: 1,
                        }
                        : {
                            id: +new Date(),
                            name: this.menuFrom.name,
                            children: [],
                            menuType: 2,
                            level: 1,
                        };
                    this.menuData.push(menu);
                } else if (this.currentMenuHandleStatus === 'append') {
                    let newMenu = this.currentMenuHandleType === 'single'
                        ? {
                            id: +new Date(),
                            name: this.menuFrom.name,
                            path: this.menuFrom.path,
                            menuType: 1,
                            level: this.currentMenuData.level + 1,
                        }
                        : {
                            id: +new Date(),
                            name: this.menuFrom.name,
                            children: [],
                            menuType: 2,
                            level: this.currentMenuData.level + 1,
                        };
                    this.currentMenuData.children.push(newMenu);
                } else {
                    this.currentMenuData.name = this.menuFrom.name;
                    if (this.currentMenuHandleType === 'single') {
                        this.currentMenuData.path = this.menuFrom.path;
                    }
                }
                //this.$message.success((this.currentMenuHandleStatus !== 'editor' ? '新建' : '编辑') + '成功');
                this.dialogMenuFromVisible = false;
            },
            allowDrop(draggingNode, dropNode, type) {
                // 如果是菜单 直接禁止
                if(dropNode.data.menuType === 1){
                    return false
                }
                if (draggingNode.data.level === dropNode.data.level) {
                    return type !== 'inner'
                } else if (draggingNode.data.level - 1 === dropNode.data.level) {
                    return type === 'inner'
                }
            },
            removeMenuData(data, node) {
                this.$confirm('此操作将同时删除该菜单下的所有子菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                });
            },
            handleMenuData(status, data, type) {
                this.menuFrom = status === 'editor' ? {name: data.name, path: data.path} : {name: "", path: ""};
                this.currentMenuHandleType = type;
                this.dialogMenuFromVisible = true;
                this.currentMenuHandleStatus = status;
                this.currentMenuData = data;
            }
        },
        components: {},
        computed: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .menuConfig {
        padding: 40px;
        width: 800px;
    }

    .tree-title {
        .handle {
            width: 190px;
            text-align: center;
        }
        .name {
            width: 100px;
        }
        .path {
            width: 100px;
        }
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
