<?php
/**
 * Created by PhpStorm.
 * User: mplociennik
 * Date: 11.10.17
 * Time: 19:35
 */

namespace AppBundle\Service;


use Symfony\Component\DependencyInjection\Container as Container;

class ConfigService
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function getConfig()
    {
        $configRepository = $this->container->get('doctrine.orm.entity_manager')->getRepository('AppBundle\Entity\Config');
        $result = $configRepository->find(1);
        echo "<pre>";
        \Doctrine\Common\Util\Debug::dump($result);
        echo "</pre>";
        die;
        return $result;
    }
}