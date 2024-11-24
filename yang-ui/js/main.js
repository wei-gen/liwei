$(document).ready(function() {
    // 数字增长动画
    function animateNumbers() {
        $('.stat-number').each(function() {
            const $this = $(this);
            const target = parseInt($this.data('count'));
            $({ Counter: 0 }).animate({
                Counter: target
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.ceil(this.Counter));
                }
            });
        });
    }

    // 当统计区域进入视口时触发动画
    const statsSection = $('.statistics');
    let animated = false;

    $(window).scroll(function() {
        // 只在存在统计区域时执行动画
        if (statsSection.length > 0 && !animated && $(this).scrollTop() + $(this).height() > statsSection.offset().top) {
            animateNumbers();
            animated = true;
        }

        // 控制返回顶部按钮的显示/隐藏
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });

    // 返回顶部功能
    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
}); 