<template>
    <div class="menuConfig">
        <el-button type="primary" @click="appendTopMenu">新建顶级菜单</el-button>
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
                            @click="() => handleMenuData('append', data)">
                      添加子菜单
                    </el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="() => handleMenuData('editor', data)">
                      编辑菜单
                    </el-button>
                    <el-button
                            type="text"
                            size="mini"
                            @click="() => handleMenuData('remove', data, node)">删除菜单
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog :title="currentMenuHandleType !== 'editor' ? '新建': '编辑' + '菜单'" width="500px" :visible.sync="dialogMenuFromVisible">
            <el-form :model="menuFrom" ref="menuFrom">
                <el-form-item label="菜单名称" label-width="80">
                    <el-input class="w380" v-model="menuFrom.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" label-width="80">
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
        <el-button @click="save">save</el-button>
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
                currentMenuHandleType: 'append',
                dialogMenuFromVisible: false,
                menuData: [],
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            save() {
                console.log(this.menuData, JSON.stringify(this.menuData));
            },
            appendTopMenu() {
                this.currentMenuHandleType = 'appendTop';
                this.dialogMenuFromVisible = true;
                this.menuFrom = {name: "", path: ""};
            },
            saveMenuFrom() {
                if (!this.menuFrom.name) {
                    this.$message.warning('请输入菜单名称');
                    return false;
                }
                // 添加顶级菜单
                if (this.currentMenuHandleType === 'appendTop') {
                    this.menuData.push({
                        id: +new Date(),
                        name: this.menuFrom.name,
                        level: 1,
                        path: this.menuFrom.path,
                        children: []
                    })
                } else if (this.currentMenuHandleType === 'append') {
                    const newChild = {
                        id: +new Date(),
                        name: this.menuFrom.name,
                        level: this.currentMenuData.level + 1,
                        path: this.menuFrom.path,
                        children: []
                    };
                    if (!this.currentMenuData.children) {
                        this.$set(this.handleMenuData, 'children', []);
                    }
                    this.currentMenuData.children.push(newChild);
                } else {
                    this.currentMenuData.name = this.menuFrom.name;
                    this.currentMenuData.path = this.menuFrom.path;
                }
                //this.$message.success((this.currentMenuHandleType !== 'editor' ? '新建' : '编辑') + '成功');
                this.dialogMenuFromVisible = false;
            },
            allowDrop(draggingNode, dropNode, type) {
                if (draggingNode.data.level === dropNode.data.level) {
                    return type !== 'inner'
                } else if (draggingNode.data.level - 1 === dropNode.data.level) {
                    return type === 'inner'
                }
            },
            handleMenuData(type, data, node) {
                if (type === 'remove') {
                    this.$confirm('此操作将同时删除该菜单下的所有子菜单, 是否继续?', '提示', {
                        confirmButtonText: '确定删除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                } else {
                    this.menuFrom = type === 'editor' ? {name: data.name, path: data.path} : {name: "", path: ""};
                    this.dialogMenuFromVisible = true;
                    this.currentMenuHandleType = type;
                    this.currentMenuData = data;
                }
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
