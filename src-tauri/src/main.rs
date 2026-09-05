// 发布版隐藏 Windows 控制台窗口；调试版保留以便查看日志
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    gearcalc_3stage_lib::run()
}
