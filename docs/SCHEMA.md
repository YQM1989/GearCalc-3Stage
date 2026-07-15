# GearCalc-3Stage Schema

本文档描述第一版计算核心的数据结构、单位、公式和输入边界。实际 TypeScript 定义位于 `src/types/gear.ts`。

## 输入对象

### GearCalcInput

| 字段 | 类型 | 单位 | 规则 |
| --- | --- | --- | --- |
| `stageCount` | `1 \| 2 \| 3` | 级 | 只计算 `stages` 中前 N 级 |
| `motorRpm` | `number` | rpm | 必须大于 0 |
| `motorTorque` | `number` | N·m | 不能小于 0 |
| `defaultEfficiency` | `number` | % | 0–100；界面修改时同步到各级 |
| `pressureAngle` | `number` | ° | 第一版固定为 20 |
| `stages` | `StageInput[]` | — | 界面始终保留 3 级，只启用前 N 级 |

### StageInput

| 字段 | 类型 | 单位 | 规则 |
| --- | --- | --- | --- |
| `module` | `number` | mm | 必须大于 0 |
| `driverTeeth` | `number` | 齿 | 必须是正整数 |
| `drivenTeeth` | `number` | 齿 | 必须是正整数 |
| `efficiency` | `number` | % | 0–100 |
| `note` | `string?` | — | 可选备注，不参与计算 |

## 结果对象

### StageCalculation

| 字段 | 含义 |
| --- | --- |
| `stageIndex` | 级数，从 1 开始 |
| `inputRpm` / `outputRpm` | 本级输入/输出转速 |
| `inputTorque` / `outputTorque` | 本级输入/输出扭矩 |
| `ratio` | 本级减速比 |
| `efficiency` | 本级效率百分数 |
| `centerDistance` | 本级理论中心距，mm |
| `note` | 输入备注的透传值 |

### GearGeometry

每个启用级生成主动齿轮和从动齿轮两条记录；输入无效时对应数值会归零：

| 字段 | 含义 |
| --- | --- |
| `stageIndex` | 所属级数 |
| `role` | `主动齿轮` 或 `从动齿轮` |
| `module` | 模数，mm |
| `teeth` | 齿数 |
| `pitchDiameter` | 节圆直径，mm |
| `addendumDiameter` | 齿顶圆直径，mm |
| `rootDiameter` | 齿根圆直径，mm |
| `circularPitch` | 圆周齿距，mm |

### GearCalculationResult

| 字段 | 含义 |
| --- | --- |
| `stages` | 每级计算结果 |
| `gears` | 齿轮几何结果 |
| `totalRatio` | 各级速比乘积 |
| `outputRpm` | 末级输出转速 |
| `outputTorque` | 末级输出扭矩 |
| `totalEfficiency` | 各级效率因子乘积，0–1 |
| `outputDirection` | 奇数级反向，偶数级同向 |
| `risks` | 输入错误和工程风险列表 |

## 计算公式

对每一级：

```text
i = z₂ / z₁
n_out = n_in / i
T_out = T_in × i × η
a = m × (z₁ + z₂) / 2
```

其中：

- `z₁` 为主动齿轮齿数；
- `z₂` 为从动齿轮齿数；
- `m` 为模数；
- `η` 为 0–1 的效率因子；
- `a` 为理论中心距。

标准全齿高直齿轮基础尺寸：

```text
d = m × z
dₐ = m × (z + 2)
d_f = m × (z - 2.5)
p = π × m
```

总结果：

```text
i_total = i₁ × i₂ × i₃
η_total = η₁ × η₂ × η₃
```

只累乘实际启用的级数。

## 校验与失败行为

- 非有限数、负转速、负扭矩、非正模数、非正整数齿数、超范围效率会产生 `severity: "error"`；
- 非法齿数会作为 0 处理，使该齿轮副速比、输出和中心距归零，避免继续展示虚假精确结果；
- 超过 100% 的效率在内部上限钳制为 100%，同时保留输入错误；
- 非 20° 压力角会产生不支持错误；
- UI 禁用压力角编辑，但计算函数仍校验直接调用者传入的数据。

## 风险规则

以下是提示，不是完整强度结论：

- 标准 20° 齿轮齿数小于 17：提示根切风险；
- 单级减速比大于 8：提示尺寸、压力、噪音和寿命风险；
- 模数不大于 0.5 且本级输出扭矩不小于 1 N·m：提示强度校核；
- 中心距小于 10 mm：提示轴、轴承和装配空间风险；
- 启用三级传动：提示效率、齿隙、噪音和装配误差累计。

这些规则不包含载荷谱、齿宽、材料许用应力、接触疲劳或弯曲疲劳计算。
