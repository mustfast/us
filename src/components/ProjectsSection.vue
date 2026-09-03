<template>
  <section class="section">
    <h2>项目经历</h2>

    <div class="project">
      <h3>公司资产中心与场景自动搭建（AssetStore）</h3>
      <div class="meta">2025.08 — 至今 · 资产管线负责人</div>
      <div class="desc">主导搭建公司资产中心，将资产语义化、中心化管理，并引入 AI 能力赋能场景自动搭建。</div>
      <ul class="duty-list">
        <li>将全部资产语义化、中心化，建立统一的 AssetStore</li>
        <li>场景师可在引擎内通过 Agent 检索资产并一键添加到场景</li>
        <li>支持通过文本描述、风格或图片在资产中心生成资产，经中心服务转为引擎可用资产后落地场景</li>
        <li>自动扩充中心资产：通过网络发现符合公司规范的资产，经自建工具自动清洗后入库</li>
      </ul>
    </div>

    <div class="project">
      <h3>物理仿真系统重建（布料模拟 / 物理破坏）</h3>
      <div class="meta">2024.08 — 2025.08 · 资产管线负责人</div>
      <div class="desc">完成公司物理仿真系统的重新构建，覆盖布料模拟与物理破坏两大方向。</div>
      <ul class="duty-list">
        <li>将游戏内布料模拟切换为 NvCloth 方案</li>
        <li>改造模拟器，搭建布料模拟仿真环境</li>
        <li>构建物理破坏效果体系</li>
        <li>完成移动端布料效果支持</li>
      </ul>
    </div>

    <div class="project">
      <h3>资产制作软件工具链</h3>
      <div class="meta">2022.08 — 2024.08 · 资产管线负责人</div>
      <div class="desc">从 0 到 1 完成公司资产制作软件工具链体系，覆盖模型、布料、粒子特效、动画、材质、骨骼六大编辑器。</div>
      <ul class="duty-list">
        <li>完成模型编辑器、布料编辑器、粒子特效编辑器、动画编辑器、材质编辑器、骨骼编辑器开发</li>
        <li>打通资产从制作到入库的完整工作流</li>
      </ul>
    </div>

    <div class="project">
      <h3>资产 LOD 清洗中心</h3>
      <div class="meta">2022.05 — 2022.08 · 资产管线负责人</div>
      <div class="desc">针对公司资产网格规模过大、性能开销过高的问题，主导 LOD 资产分级并开发自动清洗的中央服务，每月节省约 5000 美金开销。</div>
      <ul class="duty-list">
        <li>将原本需在商业软件中人工处理的 LOD 功能迁移为中央服务</li>
        <li>美术完成的 LOD 资产上传至中心服务器后自动清洗与优化，显著降低人工操作与错误率</li>
      </ul>
    </div>

    <div class="project">
      <h3>资产管线搭建</h3>
      <div class="meta">2021.12 — 2022.04 · 资产管线负责人</div>
      <div class="desc">负责公司资产管线从无到有的搭建，定义各类资产的标准规范，将外部资产统一整理为公司可用资产。</div>
      <ul class="duty-list">
        <li>完成资产 IO 统一构建，定义资产读写范式，便于开发人员扩展资产读写</li>
        <li>完成 FBX、GLTF、USD、UE 等格式到自研引擎的转换</li>
        <li>实现 UE 场景向自研引擎的整体搬迁，大幅节省资产制作成本</li>
      </ul>
    </div>

    <div class="project">
      <h3>时尚设计师软件</h3>
      <div class="meta">2020.09 — 2021.09 · 技术负责人</div>
      <div class="desc">方便服装设计师快速设计衣服并查看效果的桌面软件。</div>
      <ul class="duty-list">
        <li>基于 Qt 搭建软件框架：渲染引擎接口、Undo/Redo、序列化、模拟引擎接口、数据存储、单元测试框架</li>
        <li>数据结构设计：Vertex、Line、Pattern、Mesh 等</li>
        <li>独立完成几何库：BSpline 算法、半边结构 Mesh 设计与算法、网格化封装与改进、网格简化</li>
      </ul>
    </div>

    <div class="project">
      <h3>王华民教授 SIGGRAPH 论文技术支持</h3>
      <div class="meta">2020.10 — 2021.03 · 团队负责人</div>
      <div class="desc">为 SIGGRAPH 论文顺利录用提供技术团队支持。</div>
      <ul class="duty-list">
        <li>CPU 版本 Mesh 转换为 GPU 版本 Mesh</li>
        <li>CUDA 版本基础数学计算</li>
        <li>人体骨骼动画驱动衣服模拟生成原始网格</li>
        <li>搭建云渲染服务器并渲染所有帧数据</li>
      </ul>
    </div>

    <div class="project">
      <h3>USCAD 多套虚拟服装模拟渲染系统</h3>
      <div class="meta">2015.07 — 2021.09 · 软件开发组组长</div>
      <div class="desc">为虚拟服装产业快速生成大量服装模型并渲染的系统，集纸样制版、缝合关系建立、3D快速生成、2D/3D映射、多款式组合生成、混合渲染等功能。</div>
      <ul class="duty-list">
        <li>2D 编辑功能、2D 三角化算法实现</li>
        <li>2D 网格到 3D 网格的映射算法</li>
        <li>3D 模拟交互开发</li>
        <li>纹理对齐、镜像、拉伸算法与界面交互</li>
        <li>资源管理器设计（场景/纹理/包边厚度/刚体资源）</li>
        <li>在架构师框架下带领组员完成整体开发</li>
      </ul>
    </div>

    <div class="project">
      <h3>Style3D 单套服装模拟显示软件</h3>
      <div class="meta">2014.06 — 2015.07 · 开发工程师</div>
      <div class="desc">设计师完成打版、模拟及渲染的桌面软件。</div>
      <ul class="duty-list">
        <li>MFC + Physx 物理引擎进行布料模拟</li>
        <li>不同片网格之间的缝合关系处理</li>
        <li>网格自碰撞关系处理</li>
        <li>模拟后期网格处理：厚度、包边等效果</li>
      </ul>
    </div>
  </section>
</template>
